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


class Orchestrator:
    """
    Wires all agents together. One instance per application lifetime.

    Args:
        api_app: The FastAPI app instance, forwarded to agents that need
                 in-process HTTP calls (caregiver, accommodation).
    """

    def __init__(self, api_app=None):
        self.guardrail = GuardrailAgent()
        self.intent    = IntentAgent()
        self.triage    = TriageAgent()

        # Specialist agents keyed by intent label
        self._agents = {
            "das_faq":                RAGAgent(),
            "accommodation_request":  AccommodationAgent(),
            "medication_query":       MedicationAgent(),
            "caregiver_query":        CaregiverAgent(api_app),
            "reminder_request":       CaregiverAgent(api_app),
            "appointment_scheduling": TriageAgent(),   # hand off until scheduling agent exists
            "general_chat":           CaregiverAgent(api_app),  # existing fallback behaviour
            "out_of_scope":           None,            # handled inline below
        }

    def set_api_app(self, api_app) -> None:
        """Called by socket_server after the FastAPI app is available."""
        for agent in self._agents.values():
            if isinstance(agent, CaregiverAgent):
                agent.api_app = api_app

    async def handle(self, user_input: str, context: AgentContext) -> AgentResponse:
        # ── 1. Guardrail ──────────────────────────────────────────────────────
        guard = await self.guardrail.check(user_input, context)
        if not guard.allowed:
            return AgentResponse(
                content=f"I'm not able to help with that. {guard.block_reason or ''}".strip(),
                done=True,
            )
        sanitized = guard.sanitized_input

        # ── 2. Intent classification ──────────────────────────────────────────
        # If the previous turn was a triage clarification, still classify but
        # the triage context is already in history so confidence should be higher.
        intent_result = await self.intent.classify(sanitized, context)

        # ── 3. Route ──────────────────────────────────────────────────────────
        if intent_result.confidence < CONFIDENCE_THRESHOLD:
            # Not confident enough — ask a clarifying question
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

        # Store detected intent/entities in metadata for the agent to use if needed
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

        return await agent.process(sanitized, enriched_context)
