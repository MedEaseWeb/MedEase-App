# src/agents/base_agent.py
#
# Shared data contracts and abstract base for all agents.

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class AgentContext:
    """Carries all per-session state through the agent pipeline."""
    session_id: str
    user_id: str | None
    token: str | None                       # MedEase JWT
    history: list[dict]                     # OpenAI message-format history
    metadata: dict = field(default_factory=dict)  # arbitrary agent-specific state


@dataclass
class GuardrailResult:
    """Returned by GuardrailAgent before any other processing."""
    allowed: bool
    sanitized_input: str                    # original or PII-stripped input
    block_reason: str | None = None


@dataclass
class IntentResult:
    """Returned by IntentAgent to tell the Orchestrator where to route."""
    intent: str                             # see INTENT_LABELS in intent_agent.py
    confidence: float                       # 0.0 – 1.0
    entities: dict = field(default_factory=dict)


@dataclass
class AgentResponse:
    """Final response from a specialist agent, ready to emit to the client."""
    content: str
    updated_context: AgentContext | None = None
    done: bool = True
    stream: bool = False                    # True → stream_gen carries the token stream
    stream_gen: object = None               # AsyncGenerator[str, None] when stream=True


class BaseAgent(ABC):
    """All specialist agents implement this interface."""

    @abstractmethod
    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        """
        Process a single user turn.

        Args:
            user_input:  The (sanitized) user message for this turn.
            context:     Full session context including history and token.

        Returns:
            AgentResponse with the reply and optionally updated context.
            Set stream=True and stream_gen=<AsyncGenerator> for streaming responses.
        """
        ...
