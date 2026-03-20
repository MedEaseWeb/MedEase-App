# src/rag/indexer.py
#
# Chunks documents from src/rag/corpus/ and upserts them into ChromaDB.
#
# Usage:
#   cd backend/
#   python -m src.rag.indexer
#
# Supported corpus inputs:
#   - MedEase-Utils corpus JSON  (*_data_latest.json / *_data_YYYY-MM-DD.json)
#     Each record's `markdown` field is chunked; url/title/description stored as metadata.
#   - Plain .txt or .md files (fallback for ad-hoc documents)

from __future__ import annotations

import hashlib
import json
from pathlib import Path

CORPUS_DIR        = Path(__file__).parent / "corpus"
CHROMA_PATH       = str(Path(__file__).parent / "chroma_store")
CHROMA_COLLECTION = "emory_das"
EMBED_MODEL       = "text-embedding-3-small"
CHUNK_SIZE        = 800   # characters per chunk
CHUNK_OVERLAP     = 100


# ── Text loading ──────────────────────────────────────────────────────────────

def _load_plain(path: Path) -> list[dict]:
    """Load a .txt or .md file. Returns a single pseudo-record."""
    text = path.read_text(encoding="utf-8", errors="ignore").strip()
    if not text:
        return []
    return [{"url": "", "title": path.stem, "description": "", "markdown": text, "content_hash": ""}]


def _load_corpus_json(path: Path) -> list[dict]:
    """
    Load a MedEase-Utils corpus envelope JSON.
    Expected shape: {"source": str, "records": [{url, title, description, markdown, content_hash, ...}]}
    """
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    records = data.get("records", [])
    return [
        {
            "url":          r.get("url", ""),
            "title":        r.get("title", ""),
            "description":  r.get("description", ""),
            "markdown":     r.get("markdown", ""),
            "content_hash": r.get("content_hash", ""),
            "content_type": r.get("content_type", "html"),
        }
        for r in records
        if r.get("markdown", "").strip()
    ]


def _load_file(path: Path) -> list[dict]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return _load_corpus_json(path)
    if suffix in (".txt", ".md"):
        return _load_plain(path)
    print(f"  [skip] unsupported format: {path.name}")
    return []


# ── Chunking ──────────────────────────────────────────────────────────────────

def _chunk(text: str) -> list[str]:
    chunks, start = [], 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end].strip())
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return [c for c in chunks if len(c) > 50]


def _chunk_id(url: str, content_hash: str, index: int) -> str:
    """
    Stable ID per chunk. Incorporates content_hash so re-indexing the same
    content produces the same IDs (upsert is idempotent) and changed content
    produces new IDs (old chunks are naturally superseded via collection rebuild).
    Falls back to path-based hash for plain text files without a URL.
    """
    key = f"{url or 'plaintext'}:{content_hash}:{index}"
    return hashlib.md5(key.encode()).hexdigest()


# ── Main ──────────────────────────────────────────────────────────────────────

def build_index() -> None:
    import chromadb
    from openai import OpenAI
    from src.config import CHAT_GPT_API_KEY

    openai_client = OpenAI(api_key=CHAT_GPT_API_KEY)
    chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection    = chroma_client.get_or_create_collection(CHROMA_COLLECTION)

    files = [f for f in CORPUS_DIR.glob("**/*") if f.is_file()]
    if not files:
        print(f"No files found in {CORPUS_DIR}. Add a corpus JSON or .txt/.md files and re-run.")
        return

    total_chunks = 0

    for path in files:
        print(f"Loading: {path.name}")
        records = _load_file(path)
        if not records:
            print("  → no content, skipped")
            continue
        print(f"  → {len(records)} records")

        for record in records:
            chunks = _chunk(record["markdown"])
            if not chunks:
                continue

            for i in range(0, len(chunks), 100):
                batch      = chunks[i : i + 100]
                resp       = openai_client.embeddings.create(model=EMBED_MODEL, input=batch)
                embeddings = [r.embedding for r in resp.data]
                ids        = [_chunk_id(record["url"], record["content_hash"], i + j) for j in range(len(batch))]
                metadatas  = [
                    {
                        "url":          record["url"],
                        "title":        record["title"],
                        "description":  record["description"],
                        "content_type": record.get("content_type", ""),
                        "chunk":        i + j,
                    }
                    for j in range(len(batch))
                ]
                collection.upsert(
                    ids=ids,
                    embeddings=embeddings,
                    documents=batch,
                    metadatas=metadatas,
                )
                total_chunks += len(batch)

    print(f"\nDone. Collection '{CHROMA_COLLECTION}' has {collection.count()} chunks total ({total_chunks} upserted this run).")


if __name__ == "__main__":
    build_index()
