# src/agents/accommodation_agent.py
#
# Handles accommodation letter requests.
# Gathers required fields across turns, then generates a formatted letter.

import json
from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agents.base_agent import AgentContext, AgentResponse, BaseAgent, language_directive

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

# Fields required before the letter can be generated
REQUIRED_FIELDS = ["student_name", "disability_type", "accommodations_requested", "course_or_context"]

_GATHER_SYSTEM_PROMPT = """\
You are an Emory DAS accommodation letter assistant.

Your job is to collect the following information before generating the letter:
- Student full name
- Type of disability or condition (can be general, e.g. "ADHD", "anxiety")
- Specific accommodations being requested (e.g. extended time, quiet room, note-taking assistance)
- Course name, professor name, or general context (e.g. "all courses this semester")

Ask for any missing fields one at a time, in a friendly and professional tone.
When you have all fields, say EXACTLY: "READY_TO_GENERATE" and nothing else."""

_LETTER_SYSTEM_PROMPT = """\
You are an Emory DAS (Disability & Accessibility Services) letter writer.
Generate a professional accommodation letter based on the provided student information.
The letter should be addressed to the relevant professor or recipient, signed by DAS,
and formatted clearly with the requested accommodations as a bullet list."""

_LETTER_USER_TEMPLATE = """\
Generate an accommodation letter for:
- Student name: {student_name}
- Disability/condition: {disability_type}
- Accommodations requested: {accommodations_requested}
- Course or context: {course_or_context}"""


class AccommodationAgent(BaseAgent):
    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        fields = context.metadata.get("accommodation_fields", {})

        # Try to extract fields from user input using GPT
        fields = await self._extract_fields(user_input, fields, context)

        # Check if we have everything
        missing = [f for f in REQUIRED_FIELDS if not fields.get(f)]

        if missing:
            reply = await self._ask_for_fields(user_input, fields, context)
            updated = AgentContext(
                session_id=context.session_id,
                user_id=context.user_id,
                token=context.token,
                history=context.history + [
                    {"role": "user", "content": user_input},
                    {"role": "assistant", "content": reply},
                ],
                locale=context.locale,
                metadata={**context.metadata, "accommodation_fields": fields},
            )
            return AgentResponse(content=reply, updated_context=updated, done=True)

        # All fields present — generate the letter
        letter = await self._generate_letter(fields, locale=context.locale)
        # Clear fields from metadata after generation
        updated_metadata = {k: v for k, v in context.metadata.items() if k != "accommodation_fields"}
        updated = AgentContext(
            session_id=context.session_id,
            user_id=context.user_id,
            token=context.token,
            history=context.history + [
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": letter},
            ],
            locale=context.locale,
            metadata=updated_metadata,
        )
        return AgentResponse(content=letter, updated_context=updated, done=True)

    async def _extract_fields(self, user_input: str, existing_fields: dict, context: AgentContext) -> dict:
        """Ask GPT to pull any of the required fields out of the latest message."""
        extract_prompt = f"""\
Extract any of the following fields from the user message (return JSON):
  student_name, disability_type, accommodations_requested, course_or_context

Already known: {json.dumps(existing_fields)}
User message: "{user_input}"

Return only the newly found fields as a JSON object. Return {{}} if nothing new was found."""

        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": extract_prompt}],
            response_format={"type": "json_object"},
            temperature=0,
        )
        try:
            new_fields = json.loads(response.choices[0].message.content)
            return {**existing_fields, **{k: v for k, v in new_fields.items() if v}}
        except (json.JSONDecodeError, KeyError):
            return existing_fields

    async def _ask_for_fields(self, user_input: str, fields: dict, context: AgentContext) -> str:
        """Ask a follow-up question for the next missing field."""
        directive = language_directive(context.locale)
        gather_prompt = _GATHER_SYSTEM_PROMPT + (f"\n{directive}" if directive else "")
        messages = [
            {"role": "system", "content": gather_prompt},
            *context.history[-4:],
            {"role": "user", "content": f"Fields collected so far: {json.dumps(fields)}"},
            {"role": "user", "content": user_input},
        ]
        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.4,
        )
        return response.choices[0].message.content

    async def _generate_letter(self, fields: dict, locale: str = "en") -> str:
        user_prompt = _LETTER_USER_TEMPLATE.format(**fields)
        directive = language_directive(locale)
        letter_prompt = _LETTER_SYSTEM_PROMPT + (f"\n{directive}" if directive else "")
        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": letter_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content
