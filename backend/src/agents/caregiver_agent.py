# src/agents/caregiver_agent.py
#
# Handles caregiver workflows: add reminders (Google Calendar) and
# fetch patient data. Absorbs the function-calling logic that previously
# lived directly in socket_server.py.

import json
import httpx
from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agenticActions import tools
from src.agents.base_agent import AgentContext, AgentResponse, BaseAgent

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

_SYSTEM_PROMPT = """\
You are a friendly and knowledgeable caregiver assistant.
Help the user set reminders by gathering all necessary details:
summary, start_time, end_time, and optional recurrence_days.
If the user asks for patient data, gather patient_email and generated_key and call get_patient_data.
Keep asking follow-up questions until you have everything needed, then call the appropriate function."""


class CaregiverAgent(BaseAgent):
    def __init__(self, api_app=None):
        self.api_app = api_app

    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        history = context.history + [{"role": "user", "content": user_input}]

        gpt_resp = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": _SYSTEM_PROMPT}, *history],
            functions=tools,
            function_call="auto",
        )
        msg = gpt_resp.choices[0].message

        # Plain-text reply
        if msg.content:
            history.append({"role": "assistant", "content": msg.content})
            updated = self._updated_context(context, history)
            return AgentResponse(content=msg.content, updated_context=updated, done=True)

        # Function call
        if msg.function_call:
            return await self._handle_function_call(msg, history, context)

        # Fallback
        fallback = "I'm not sure how to help with that. Could you clarify what you need?"
        history.append({"role": "assistant", "content": fallback})
        return AgentResponse(content=fallback, updated_context=self._updated_context(context, history), done=True)

    async def _handle_function_call(self, msg, history: list, context: AgentContext) -> AgentResponse:
        fn_name = msg.function_call.name
        args = json.loads(msg.function_call.arguments)

        if fn_name == "add_reminder":
            required = ["summary", "start_time", "end_time"]
            missing = [f for f in required if not args.get(f)]
            if missing:
                return await self._ask_followup(msg, history, context)

            payload = {
                "summary": args.get("summary"),
                "description": args.get("description"),
                "location": args.get("location"),
                "start_time": args.get("start_time"),
                "end_time": args.get("end_time"),
                "recurrence_days": args.get("recurrence_days"),
            }
            func_resp = await self._post(context.token, "/google/add-calendar-event", payload)

        elif fn_name == "get_patient_data":
            required = ["patient_email", "generated_key"]
            missing = [f for f in required if not args.get(f)]
            if missing:
                return await self._ask_followup(msg, history, context)

            payload = {
                "patient_email": args.get("patient_email"),
                "generated_key": args.get("generated_key"),
            }
            func_resp = await self._post(context.token, "/caregiver/patient-data", payload)

        else:
            func_resp = {"error": f"Unknown function: {fn_name}"}

        history.extend([
            {"role": "assistant", "function_call": msg.function_call},
            {"role": "function", "name": fn_name, "content": json.dumps(func_resp)},
        ])

        final = await _client.chat.completions.create(model="gpt-4o-mini", messages=history)
        reply = final.choices[0].message.content
        history.append({"role": "assistant", "content": reply})

        return AgentResponse(content=reply, updated_context=self._updated_context(context, history), done=True)

    async def _ask_followup(self, msg, history: list, context: AgentContext) -> AgentResponse:
        history.append({"role": "assistant", "function_call": msg.function_call})
        followup = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=history,
            functions=tools,
            function_call="auto",
        )
        question = followup.choices[0].message.content
        history.append({"role": "assistant", "content": question})
        return AgentResponse(content=question, updated_context=self._updated_context(context, history), done=True)

    async def _post(self, token: str | None, path: str, payload: dict) -> dict:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        try:
            async with httpx.AsyncClient(
                app=self.api_app,
                base_url="http://localhost:8081",
                headers=headers,
            ) as http:
                resp = await http.post(path, json=payload)
            return resp.json() if resp.status_code in (200, 201) else {"error": resp.text}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def _updated_context(context: AgentContext, history: list) -> AgentContext:
        return AgentContext(
            session_id=context.session_id,
            user_id=context.user_id,
            token=context.token,
            history=history,
            metadata=context.metadata,
        )
