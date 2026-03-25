# MedEase Multi-Agent RAG Architecture

## Overview

A RAG-based multi-agent chat system where users interact via natural language and are triaged to specialized agents. Designed initially for the Emory DAS (Disability & Accessibility Services) use case, with a corpus of DAS-specific documents.

---

## System Flow

```
User Input (Socket.IO)
       │
       ▼
┌─────────────────┐
│ Guardrail Agent  │  ← safety, PII, off-topic filter
└────────┬────────┘
         │ passes
         ▼
┌──────────────────────┐
│ Intent Classifier    │  ← outputs intent label + confidence score
│ Agent                │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│                  Orchestrator Agent                  │
│  (routes by intent; manages agent lifecycle/memory)  │
└──┬──────────┬──────────┬──────────┬──────────┬───────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
Triage    RAG Agent  Accomm.    Medication  Caregiver
Agent     (DAS Q&A)  Letter     Agent       Agent
           │         Agent
           ▼
     Vector Store
     (Emory DAS corpus)
```

---

## Agent Definitions

### 1. Guardrail Agent
**File:** `src/agents/guardrail_agent.py`

Runs first on every message — fast, cheap (rules-based + GPT-4o-mini fallback).

- Blocks: jailbreaks, harmful content, fully off-domain requests
- Soft-blocks: PII stripping, profanity softening
- Returns: `GuardrailResult(allowed: bool, reason: str, sanitized_input: str)`

### 2. Intent Classification Agent
**File:** `src/agents/intent_agent.py`

Extends existing `classifier_service.py` pattern with DAS-specific labels:

| Label | Example |
|---|---|
| `accommodation_request` | "I need a letter for my professor" |
| `das_faq` | "What services does DAS provide?" |
| `appointment_scheduling` | "Book a meeting with my advisor" |
| `medication_query` | "What does my prescription say?" |
| `caregiver_query` | "Check on my patient" |
| `reminder_request` | "Remind me to take my meds at 8pm" |
| `general_chat` | Fallback |
| `out_of_scope` | Redirect or refuse |

- Returns: `IntentResult(intent: str, confidence: float, entities: dict)`

### 3. Orchestrator Agent
**File:** `src/agents/orchestrator.py`

Central router — the only agent that directly interfaces with the socket server.

- Routes by intent label + confidence
- If confidence < 0.6 → delegates to Triage Agent first
- Maintains master multi-turn conversation context across agent handoffs
- After triage resolves intent → re-routes to correct specialist agent

### 4. Triage Agent
**File:** `src/agents/triage_agent.py`

Activated when intent confidence is below threshold or input is ambiguous.

- Asks targeted clarifying questions
- Feeds resolved intent back to the Orchestrator
- Example: "Are you asking about your accommodations, or a general DAS question?"

### 5. RAG Agent
**File:** `src/agents/rag_agent.py` + `src/rag/`

Answers questions grounded in the Emory DAS corpus.

**Stack:**
- Embeddings: `text-embedding-3-small` (OpenAI) or `all-MiniLM-L6-v2` (local)
- Vector store: ChromaDB (local, in-process) — swap to Pinecone if scale demands
- Corpus: Emory DAS PDFs, FAQs, policy docs → chunked + embedded at index time
- Retrieval: top-k cosine similarity → stuffed into GPT context window

**Pipeline:**
```
query → embed → similarity search → retrieve top-k chunks
      → build context prompt → GPT → answer with citations
```

**Prompt template:**
```
You are an Emory DAS advisor. Using only the following retrieved context:
{retrieved_chunks}

Answer the student's question: {query}

If the answer is not in the context, say so — do not hallucinate.
```

### 6. Accommodation Letter Agent
**File:** `src/agents/accommodation_agent.py`

Handles accommodation letter generation (frontend button already exists).

- Gathers: student info, disability type, requested accommodations, course/professor
- Generates formatted letter via GPT fill-in on a template
- Optional: send via Gmail using existing `/google/gmail` integration

### 7. Medication Agent
**File:** `src/agents/medication_agent.py`

Thin wrapper around existing `ChatGPT.extract_medication_info()` and medication routes.

### 8. Caregiver Agent
**File:** `src/agents/caregiver_agent.py`

Thin wrapper around existing caregiver routes and `get_patient_data` agentic action.

---

## File Structure

```
backend/src/
├── agents/
│   ├── __init__.py
│   ├── base_agent.py          # Abstract base: process(input, context) → AgentResponse
│   ├── guardrail_agent.py
│   ├── intent_agent.py
│   ├── orchestrator.py        # Central router; replaces socket_server branching logic
│   ├── triage_agent.py
│   ├── rag_agent.py
│   ├── accommodation_agent.py
│   ├── medication_agent.py
│   └── caregiver_agent.py
├── rag/
│   ├── __init__.py
│   ├── indexer.py             # Chunk + embed corpus → vector store
│   ├── retriever.py           # Query vector store, return top-k chunks
│   └── corpus/                # Raw Emory DAS docs (PDFs, markdown, text)
├── services/                  # Existing — unchanged
├── LLMmodel/                  # Existing — unchanged
├── socket_server.py           # Slim down → just calls orchestrator.handle()
└── agenticActions.py          # Existing — absorbed by specialist agents
```

---

## Shared Data Contracts

```python
# base_agent.py types used by all agents

@dataclass
class AgentContext:
    session_id: str
    user_id: str | None
    history: list[dict]          # OpenAI message format
    metadata: dict               # arbitrary per-session state

@dataclass
class AgentResponse:
    content: str                 # text to send back to user
    next_agent: str | None       # if handoff needed, name of next agent
    updated_context: AgentContext
    done: bool                   # True = response is final, emit to client
```

---

## Concrete Example Walkthroughs

**"I have ADHD and need an accommodation letter for my CS 101 final exam"**
```
1. Guardrail: ✅ allowed
2. Intent: accommodation_request (0.91), entities: {disability: ADHD, course: CS 101}
3. Orchestrator → Accommodation Letter Agent
4. Agent: missing fields → asks for accommodation type
5. User answers → letter generated → optional Gmail send
```

**"What's the deadline to register with DAS?"**
```
1. Guardrail: ✅ allowed
2. Intent: das_faq (0.87)
3. Orchestrator → RAG Agent
4. Embed query → retrieve DAS registration policy chunk
5. GPT answers with source citation
```

**"Help me" (ambiguous)**
```
1. Guardrail: ✅ allowed
2. Intent: general_chat (0.45) — below threshold
3. Orchestrator → Triage Agent
4. Triage: "Are you looking for help with accommodations, a DAS question, or something else?"
5. User clarifies → Triage feeds intent back → Orchestrator re-routes
```

---

## Implementation Order

1. `base_agent.py` — shared interface and data contracts
2. `guardrail_agent.py` — simple rules first, harden later
3. `intent_agent.py` — extend existing BART classifier with DAS labels
4. `orchestrator.py` — router that replaces current socket_server branching logic
5. `rag/` module — indexer + retriever + ChromaDB setup
6. `rag_agent.py` — RAG pipeline connected to vector store
7. `accommodation_agent.py` — backend for the existing frontend button
8. `triage_agent.py` — low-confidence fallback with clarifying questions
9. Thin wrappers: `medication_agent.py`, `caregiver_agent.py`
10. Refactor `socket_server.py` → calls `orchestrator.handle()` only

---

## Resolved Decisions

| Decision | Resolution |
|---|---|
| **Vector store** | ChromaDB — local, in-process. Pinecone deferred until scale demands it. |
| **Corpus format** | Web-scraped markdown + PDF text, produced by MedEase-Utils (`Scraping/`). Output: `emory_das_data_latest.json` → dropped into `backend/src/rag/corpus/` → indexed by `indexer.py`. |
| **Scope** | Emory DAS only for now. Architecture is config-driven in Utils (`config/emory_das.json`) to support additional institutions later. |
| **Auth** | RAG and DAS-specific agents require authentication. Users must be logged in to access institution-specific content. |
| **Streaming** | RAG responses stream token-by-token, consistent with the existing simplification pipeline. |

