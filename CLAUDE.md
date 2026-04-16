# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MedEase is a full-stack healthcare application with a React/Vite frontend deployed to Cloudflare Pages and a FastAPI backend deployed to GCP Cloud Run. Core features: RAG-based multi-agent chat, waitlist, i18n (en/zh-CN/ko/es/ja), demo workflow.

See `docs/agent-architecture.md` for the full multi-agent pipeline design.

## Local Development

```bash
./dev.sh             # start frontend + backend
./dev.sh backend     # backend only
./dev.sh frontend    # frontend only
```

`dev.sh` activates the `medease-backend` conda environment, starts uvicorn on port 8081, and starts the Vite dev server on port 5173. Ctrl+C shuts down cleanly.

### Frontend (`/frontend`)

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build → dist/
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Backend (`/backend`)

```bash
# Conda environment (preferred):
conda activate medease-backend

# Or venv fallback (Python 3.12 required):
python3.12 -m venv venv-fastapi
source venv-fastapi/bin/activate

pip install -r requirements.txt

# Local dev server
python -m uvicorn main:app --reload --port 8081

# After adding packages
pip freeze > requirements.txt

# Build RAG vector store (after adding docs to src/rag/corpus/):
pip install chromadb pypdf
python -m src.rag.indexer
```

## Architecture

### Frontend (`frontend/src/`)

- **`main.jsx`** — entry point; wraps app in `AuthProvider`
- **`App.jsx`** — router; public routes + protected routes (via `ProtectedRoutes`)
- **`context/AuthContext.jsx`** — global auth state (JWT token, user info)
- **`pages/`** — `LandingPage/`, `auth/`, `chat/`, `settings/`, `UserSurvey/`, `QuestionsInTheLoop/`, `Community/`, `Notes/`, `utility/`
- **`pages/utility/TopBar.jsx`** — shared top bar with language switcher
- **`pages/utility/SocketConnection.jsx`** — Socket.IO client setup

Protected routes: `/dashboard`, `/settings`

### Backend (`backend/`)

- **`main.py`** — FastAPI app; mounts 3 routers and Socket.IO; calls `socket_server.set_api_app()` to wire agents
- **`src/config.py`** — loads all secrets/config from `.env`
- **`src/database.py`** — async MongoDB connection via Motor; exposes collection objects
- **`src/routes/`** — `auth.py` (registration/login/JWT), `general.py` (user profile, patient key), `waitlist.py`
- **`src/models/`** — Pydantic v2 schemas: `userModel.py`, `waitlistModel.py`
- **`src/socket_server.py`** — thin Socket.IO layer; delegates all logic to `Orchestrator`

### Multi-Agent Chat System (`backend/src/agents/`)

All chat logic flows through this pipeline: **Guardrail → Intent → Orchestrator → Specialist Agent**

| File | Role |
|---|---|
| `base_agent.py` | Shared contracts: `AgentContext`, `AgentResponse`, `GuardrailResult`, `IntentResult`, `BaseAgent` |
| `orchestrator.py` | Central router; maps intent labels to agents; delegates to triage if confidence < 0.65 |
| `guardrail_agent.py` | Safety filter — blocks jailbreaks/off-topic, strips PII; runs first on every message |
| `intent_agent.py` | GPT classifier; 8 intent labels + confidence score |
| `triage_agent.py` | Asks one clarifying question when intent is ambiguous |
| `rag_agent.py` | DAS Q&A via ChromaDB vector store; lazy-loads retriever; falls back to GPT-only if not indexed |
| `accommodation_agent.py` | Multi-turn accommodation letter generator (collects 4 fields, then generates letter) |
| `medication_agent.py` | Medication Q&A wrapper |
| `caregiver_agent.py` | Reminders (Google Calendar) + patient data retrieval via function calling |

Intent labels: `accommodation_request`, `das_faq`, `appointment_scheduling`, `medication_query`, `caregiver_query`, `reminder_request`, `general_chat`, `out_of_scope`

### RAG Pipeline (`backend/src/rag/`)

| File | Role |
|---|---|
| `indexer.py` | Chunks `.txt`/`.md`/`.pdf` files from `corpus/` and upserts to ChromaDB |
| `retriever.py` | Queries ChromaDB, returns top-k chunks for a given query |
| `corpus/` | Drop raw Emory DAS documents here before running the indexer |

Vector store: ChromaDB (local, persistent at `src/rag/chroma_store/`). Embeddings: `text-embedding-3-small`.

### API Route Prefixes

| Prefix | File | Purpose |
|--------|------|---------|
| `/auth` | `routes/auth.py` | Registration, login, JWT — pending replacement by Firebase Auth (ADR-006) |
| `/general` | `routes/general.py` | User profile email, patient key generation |
| `/waitlist` | `routes/waitlist.py` | Landing page waitlist join |

### MongoDB Collections

`config.py` loads: `userInfo`, `waitlist`, `patientKeys`. Remaining collections (`medication`, `medicalReport`, `patientData`, `patientDiary`) are referenced in `database.py` but their route files have been removed (ADR-007). Full migration to Firestore pending (ADR-006).

### Deployment

- **Frontend**: Cloudflare Pages — auto-deploys on push to `main` via GitHub Actions; live at `https://medease.pages.dev`
- **Backend**: GCP Cloud Run, project `medease-491604`, region `us-central1`; deploy with `gcloud run deploy medease-backend --source . --region us-central1 --allow-unauthenticated --port 8080` from `backend/`; live at `https://medease-backend-476216843409.us-central1.run.app`

## Environment Variables

Backend `.env` needs: MongoDB URI + collection names, JWT secret, OpenAI API key.

Frontend `.env` needs: API base URL.

## Key Reference

- **`docs/agent-architecture.md`** — full multi-agent RAG architecture design, agent definitions, data flow walkthroughs, and open decisions. This file is mirrored at `../MedEase-Meta/docs/agent-architecture.md`. The MedEase-Meta workspace (`../MedEase-Meta/`) holds org-level context, cross-project architecture decisions, and the CLAUDE.md for the full organization.
