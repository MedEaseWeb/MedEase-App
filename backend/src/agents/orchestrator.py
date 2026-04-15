# src/agents/orchestrator.py
#
# Central router. The socket server calls orchestrator.handle() for every
# user message. Runs: guardrail → intent → specialist agent.
#
# DEV MODE: if context.metadata["dev_mode"] is True, all LLM calls are
# bypassed and a stub response is returned immediately. Toggle via the
# Settings pane in the frontend — never ships to main.

import asyncio
import itertools
from typing import AsyncGenerator
from src.agents.base_agent import AgentContext, AgentResponse

_DEV_STUBS: dict[str, itertools.cycle] = {
    "en": itertools.cycle([
        "**[DEV]** Stub reply — pipeline connected. No LLM was called.",
        "**[DEV]** Socket.IO → Orchestrator → stub ✓ Everything is wired.",
        "**[DEV]** History, locale, and context are flowing correctly.",
        "**[DEV]** Toggle Dev Mode off in Settings to use real agents.",
    ]),
    "zh-CN": itertools.cycle([
        "**[开发模式]** 存根回复 — 管道已连接，未调用任何 LLM。",
        "**[开发模式]** Socket.IO → 编排器 → 存根 ✓ 一切正常。",
        "**[开发模式]** 历史记录、语言和上下文均正常传递。",
        "**[开发模式]** 在设置中关闭开发模式以使用真实代理。",
    ]),
    "ko": itertools.cycle([
        "**[개발 모드]** 스텁 응답 — 파이프라인 연결됨. LLM 호출 없음.",
        "**[개발 모드]** Socket.IO → 오케스트레이터 → 스텁 ✓ 정상 작동.",
        "**[개발 모드]** 히스토리, 로케일, 컨텍스트가 올바르게 전달됩니다.",
        "**[개발 모드]** 실제 에이전트를 사용하려면 설정에서 개발 모드를 끄세요.",
    ]),
    "es": itertools.cycle([
        "**[MODO DEV]** Respuesta stub — pipeline conectado. No se llamó a ningún LLM.",
        "**[MODO DEV]** Socket.IO → Orquestador → stub ✓ Todo funciona.",
        "**[MODO DEV]** Historial, locale y contexto fluyen correctamente.",
        "**[MODO DEV]** Desactiva el modo Dev en Ajustes para usar los agentes reales.",
    ]),
}


async def _dev_stream(text: str) -> AsyncGenerator[str, None]:
    """Yield the stub text word-by-word to simulate streaming."""
    words = text.split(" ")
    for i, word in enumerate(words):
        yield word if i == 0 else " " + word
        await asyncio.sleep(0.045)
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
        # ── 0. Dev mode — bypass all LLM calls ───────────────────────────────
        if context.metadata.get("dev_mode"):
            stubs = _DEV_STUBS.get(context.locale, _DEV_STUBS["en"])
            text  = next(stubs)
            return AgentResponse(content="", stream=True, stream_gen=_dev_stream(text), done=True)

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
