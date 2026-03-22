# src/agents/orchestrator.py
#
# Central router. The socket server calls orchestrator.handle() for every
# user message. Runs: guardrail → intent → specialist agent.

from src.agents.base_agent import AgentContext, AgentResponse
from src.agents.guardrail_agent import GuardrailAgent
from src.agents.intent_agent import IntentAgent, CONFIDENCE_THRESHOLD
from src.agents.triage_agent import TriageAgent
from src.agents.rag_agent import RAGAgent
from src.agents.accommodation_agent import AccommodationAgent
from src.agents.medication_agent import MedicationAgent
from src.agents.caregiver_agent import CaregiverAgent

_AGENT_LABELS = {
    "das_faq":               "DAS FAQ",
    "accommodation_request": "Accommodation",
    "medication_query":      "Medication",
    "caregiver_query":       "Caregiver",
    "reminder_request":      "Reminder",
    "appointment_scheduling":"Scheduling",
    "general_chat":          "General",
}


class Orchestrator:
    def __init__(self, api_app=None):
        self.guardrail = GuardrailAgent()
        self.intent    = IntentAgent()
        self.triage    = TriageAgent()

        self._agents = {
            "das_faq":                RAGAgent(),
            "accommodation_request":  AccommodationAgent(),
            "medication_query":       MedicationAgent(),
            "caregiver_query":        CaregiverAgent(api_app),
            "reminder_request":       CaregiverAgent(api_app),
            "appointment_scheduling": TriageAgent(),
            "general_chat":           CaregiverAgent(api_app),
            "out_of_scope":           None,
        }

    def set_api_app(self, api_app) -> None:
        for agent in self._agents.values():
            if isinstance(agent, CaregiverAgent):
                agent.api_app = api_app

    async def handle(self, user_input: str, context: AgentContext, emit_step=None) -> AgentResponse:
        async def _step(step_id: str, label: str, state: str, **meta):
            if emit_step:
                await emit_step(step_id, label, state, **meta)

        # ── 1. Guardrail (always runs) ────────────────────────────────────────
        await _step("guardrail", "Safety check", "running")
        guard = await self.guardrail.check(user_input, context)
        if not guard.allowed:
            await _step("guardrail", "Safety check", "blocked")
            return AgentResponse(
                content=f"I'm not able to help with that. {guard.block_reason or ''}".strip(),
                done=True,
            )
        await _step("guardrail", "Safety check", "done")
        sanitized = guard.sanitized_input

        # ── 2. Active multi-turn flow bypass ──────────────────────────────────
        # If an accommodation flow is already collecting fields, skip intent
        # re-classification — mid-flow answers like "CS 253" would otherwise
        # be misclassified as out_of_scope.
        if context.metadata.get("accommodation_fields") is not None:
            await _step("agent", "Accommodation", "running")
            result = await self._agents["accommodation_request"].process(sanitized, context)
            await _step("agent", "Accommodation", "done")
            return result

        # ── 3. Intent classification ──────────────────────────────────────────
        await _step("intent", "Identifying intent", "running")
        intent_result = await self.intent.classify(sanitized, context)
        intent_display = intent_result.intent.replace("_", " ").title()
        await _step("intent", f"{intent_display} ({int(intent_result.confidence * 100)}%)", "done")

        # ── 4. Route ──────────────────────────────────────────────────────────
        if intent_result.confidence < CONFIDENCE_THRESHOLD:
            return await self.triage.process(sanitized, context)

        if intent_result.intent == "out_of_scope":
            return AgentResponse(
                content=(
                    "That's outside what I can help with here. "
                    "For healthcare questions try the relevant section of the app; "
                    "for DAS questions visit the Emory DAS office directly."
                ),
                done=True,
            )

        agent = self._agents.get(intent_result.intent, self.triage)

        enriched_context = AgentContext(
            session_id=context.session_id,
            user_id=context.user_id,
            token=context.token,
            history=context.history,
            metadata={
                **context.metadata,
                "intent": intent_result.intent,
                "confidence": intent_result.confidence,
                "entities": intent_result.entities,
                "awaiting_triage_clarification": False,
            },
        )

        # RAG agent handles its own step emissions (rag retrieval + generate)
        if isinstance(agent, RAGAgent):
            return await agent.process(sanitized, enriched_context, emit_step=emit_step)

        # All other agents: emit running/done around process()
        agent_label = _AGENT_LABELS.get(intent_result.intent, "Processing")
        await _step("agent", agent_label, "running")
        result = await agent.process(sanitized, enriched_context)
        await _step("agent", agent_label, "done")
        return result
