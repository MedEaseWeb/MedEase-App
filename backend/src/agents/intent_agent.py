# src/agents/intent_agent.py
#
# Classifies the user's intent and extracts relevant entities.
# Routes decisions are made by the Orchestrator based on this output.

import json
from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agents.base_agent import AgentContext, IntentResult

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

# Confidence threshold below which the Orchestrator will invoke TriageAgent.
CONFIDENCE_THRESHOLD = 0.65

# All valid intent labels. Add new ones here and register an agent in orchestrator.py.
INTENT_LABELS = [
    "accommodation_request",   # student needs accommodation letter / form
    "das_faq",                 # general question answerable from DAS corpus
    "appointment_scheduling",  # book/cancel meeting with advisor or doctor
    "medication_query",        # questions about prescriptions or medications
    "caregiver_query",         # caregiver accessing patient data
    "reminder_request",        # add a calendar reminder / Google Calendar event
    "general_chat",            # small talk or ambiguous but benign
    "out_of_scope",            # clearly outside the app's domain
]

_SYSTEM_PROMPT = f"""\
You are an intent classifier for a healthcare and university disability services app (Emory DAS).

Given the user's message (and optionally recent conversation history), classify it into one of these intents:
{json.dumps(INTENT_LABELS, indent=2)}

Also extract any relevant entities (e.g. disability type, course name, medication name, patient email).

Return a JSON object with exactly these keys:
  "intent"     : one of the intent labels above
  "confidence" : float between 0.0 and 1.0
  "entities"   : object of extracted key-value pairs (can be empty)

Return ONLY valid JSON — no markdown, no extra text."""


class IntentAgent:
    async def classify(self, user_input: str, context: AgentContext) -> IntentResult:
        # Include last few turns for context without blowing the prompt
        recent_history = context.history[-6:] if len(context.history) > 6 else context.history
        messages = [
            {"role": "system", "content": _SYSTEM_PROMPT},
            *recent_history,
            {"role": "user", "content": user_input},
        ]

        response = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0,
        )

        try:
            result = json.loads(response.choices[0].message.content)
            intent = result.get("intent", "general_chat")
            if intent not in INTENT_LABELS:
                intent = "general_chat"
            return IntentResult(
                intent=intent,
                confidence=float(result.get("confidence", 0.5)),
                entities=result.get("entities", {}),
            )
        except (json.JSONDecodeError, KeyError, ValueError):
            return IntentResult(intent="general_chat", confidence=0.5)
