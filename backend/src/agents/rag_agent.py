# src/agents/rag_agent.py
#
# Answers questions grounded in the Emory DAS corpus via RAG.
# Responses stream token-by-token via AsyncOpenAI.
# Retrieval is handled by src/rag/retriever.py (ChromaDB).

from __future__ import annotations
from typing import AsyncGenerator

from openai import AsyncOpenAI
from src.config import CHAT_GPT_API_KEY
from src.agents.base_agent import AgentContext, AgentResponse, BaseAgent, language_directive

_client = AsyncOpenAI(api_key=CHAT_GPT_API_KEY)

_SYSTEM_PROMPT = """\
You are a knowledgeable Emory DAS (Disability & Accessibility Services) advisor.
Answer the student's question clearly and accurately using the retrieved context provided.
If the answer is not in the context, say so and suggest the student contact DAS directly.
Keep responses concise and student-friendly.
When citing sources, use the page title naturally in your answer (e.g. "According to the Registration page...")."""

_RAG_PROMPT_TEMPLATE = """\
Use the following retrieved context from Emory DAS documents to answer the question.
If the answer is not covered, say you don't have that specific information and suggest contacting DAS directly.

--- Retrieved Context ---
{context}
--- End Context ---

Student question: {question}"""

_NO_RAG_PROMPT_TEMPLATE = """\
Answer the following question about Emory DAS (Disability & Accessibility Services) as best you can.
Recommend the student visit the DAS website or office for authoritative information.

Student question: {question}"""


class RAGAgent(BaseAgent):
    def __init__(self):
        # Retriever is imported lazily so the app starts even if ChromaDB
        # is not yet installed or the corpus has not been indexed yet.
        self._retriever = None

    def _get_retriever(self):
        if self._retriever is None:
            try:
                from src.rag.retriever import Retriever
                self._retriever = Retriever()
            except Exception as exc:
                print(f"[RAGAgent] Retriever unavailable: {exc}")
                self._retriever = None
        return self._retriever

    def _build_context_str(self, chunks: list[dict]) -> str:
        """Format retrieved chunks into a context block with source labels."""
        parts = []
        for i, chunk in enumerate(chunks, 1):
            label = chunk["title"] or chunk["url"] or f"Source {i}"
            parts.append(f"[{label}]\n{chunk['text']}")
        return "\n\n".join(parts)

    def _build_messages(self, user_input: str, context: AgentContext, chunks: list[dict]) -> list[dict]:
        if chunks:
            user_prompt = _RAG_PROMPT_TEMPLATE.format(
                context=self._build_context_str(chunks),
                question=user_input,
            )
        else:
            user_prompt = _NO_RAG_PROMPT_TEMPLATE.format(question=user_input)

        directive = language_directive(context.locale)
        system = _SYSTEM_PROMPT + (f"\n{directive}" if directive else "")

        return [
            {"role": "system", "content": system},
            *context.history[-6:],
            {"role": "user", "content": user_prompt},
        ]

    async def _stream(self, messages: list[dict]) -> AsyncGenerator[str, None]:
        stream = await _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.3,
            stream=True,
        )
        async for chunk in stream:
            token = chunk.choices[0].delta.content
            if token:
                yield token

    async def process(self, user_input: str, context: AgentContext) -> AgentResponse:
        retriever = self._get_retriever()
        chunks = retriever.query(user_input, top_k=4) if retriever else []
        messages = self._build_messages(user_input, context, chunks)

        return AgentResponse(
            content="",
            stream=True,
            stream_gen=self._stream(messages),
            # updated_context is built by socket_server once the stream completes,
            # since the full reply text isn't known until then.
            updated_context=None,
            done=True,
        )
