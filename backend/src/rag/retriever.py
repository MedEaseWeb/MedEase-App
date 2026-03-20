# src/rag/retriever.py
#
# Queries the ChromaDB vector store and returns the top-k relevant chunks
# with source metadata for the RAG agent to use in citations.
#
# Prerequisites:
#   pip install chromadb openai
#   Run src/rag/indexer.py at least once to build the store.

from __future__ import annotations

CHROMA_COLLECTION = "emory_das"
CHROMA_PATH       = "src/rag/chroma_store"
EMBED_MODEL       = "text-embedding-3-small"


class Retriever:
    def __init__(self):
        import chromadb
        from openai import OpenAI
        from src.config import CHAT_GPT_API_KEY

        self._openai     = OpenAI(api_key=CHAT_GPT_API_KEY)
        self._chroma     = chromadb.PersistentClient(path=CHROMA_PATH)
        self._collection = self._chroma.get_collection(CHROMA_COLLECTION)

    def query(self, text: str, top_k: int = 4) -> list[dict]:
        """
        Return the top-k most relevant chunks for `text`.

        Each result is a dict:
            {
                "text":  str,   # the chunk content
                "url":   str,   # source page URL (empty for plain-text docs)
                "title": str,   # source page title
            }
        """
        embedding = self._embed(text)
        results   = self._collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
            include=["documents", "metadatas"],
        )
        docs   = results.get("documents", [[]])[0]
        metas  = results.get("metadatas", [[]])[0]
        return [
            {
                "text":  doc,
                "url":   m.get("url", ""),
                "title": m.get("title", ""),
            }
            for doc, m in zip(docs, metas)
        ]

    def _embed(self, text: str) -> list[float]:
        resp = self._openai.embeddings.create(model=EMBED_MODEL, input=text)
        return resp.data[0].embedding
