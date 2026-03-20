# src/agents/triage_agent.py
#
# Invoked when intent confidence is below threshold or input is ambiguous.
# Asks targeted clarifying questions and stores the pending intent in context.

from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agents.base_agent import AgentContext, AgentResponse, BaseAgent

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

_SYSTEM_PROMPT = """\
You are a friendly triage assistant for a healthcare and university disability services app (Emory DAS).

The user's request was unclear. Ask ONE short, targeted clarifying question to determine what they need.
Focus on distinguishing between:
- Accommodation letters or DAS registration
- General DAS policy questions
- Medication or health record questions
- Caregiver / patient data access
- Scheduling a reminder or appointment

Keep the question brief and friendly. Do not ask multiple questions at once."""


class TriageAgent(BaseAgent):
    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        messages = [
            {"role": "system", "content": _SYSTEM_PROMPT},
            *context.history,
            {"role": "user", "content": user_input},
        ]

        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.4,
        )

        reply = response.choices[0].message.content

        updated = AgentContext(
            session_id=context.session_id,
            user_id=context.user_id,
            token=context.token,
            history=context.history + [
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": reply},
            ],
            metadata={**context.metadata, "awaiting_triage_clarification": True},
        )

        return AgentResponse(content=reply, updated_context=updated, done=True)
