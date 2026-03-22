# src/agents/medication_agent.py
#
# Thin wrapper around existing medication functionality.
# Delegates complex extraction to ChatGPT.extract_medication_info().

from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agents.base_agent import AgentContext, AgentResponse, BaseAgent

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

_SYSTEM_PROMPT = """\
You are a helpful medication assistant within the MedEase app.
Help the user understand their medications, schedules, side effects, and prescription details.
If the user wants to extract or save medication information, let them know they can use
the Medication section of the app to upload a prescription note.
Keep answers clear, friendly, and medically accurate."""


class MedicationAgent(BaseAgent):
    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        messages = [
            {"role": "system", "content": _SYSTEM_PROMPT},
            *context.history[-6:],
            {"role": "user", "content": user_input},
        ]

        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.3,
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
            metadata=context.metadata,
        )

        return AgentResponse(content=reply, updated_context=updated, done=True)
