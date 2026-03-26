# MedEase App

An accessibility-focused healthcare assistant for Emory students navigating Disability and Accessibility Services (DAS). MedEase simplifies medical documentation, answers accommodation questions through a multi-agent RAG chat system, and helps caregivers stay informed.

**Stack:** React/Vite · FastAPI · MongoDB · ChromaDB · Socket.IO · Google Cloud App Engine · Cloudflare Pages

---

## Project Structure

```
MedEase-App/
├── frontend/          # React/Vite SPA → Cloudflare Pages
├── backend/           # FastAPI backend → Google Cloud App Engine
│   ├── main.py        # App entry point; mounts routers + Socket.IO
│   ├── app.yaml       # GCP App Engine config
│   ├── requirements.txt
│   └── src/
│       ├── agents/    # Multi-agent chat pipeline
│       ├── rag/       # RAG indexer, retriever, ChromaDB vector store
│       ├── routes/    # API route handlers (auth, medication, caregiver, …)
│       ├── services/  # Business logic (simplification, classification)
│       ├── models/    # Pydantic v2 schemas
│       └── config.py  # Loads all secrets from .env
├── docs/
│   └── agent-architecture.md  # Full multi-agent RAG design
└── dev.sh             # Local development launcher
```

---

## Local Development

```bash
./dev.sh             # start frontend + backend
./dev.sh backend     # backend only  →  http://localhost:8081
./dev.sh frontend    # frontend only →  http://localhost:5173
```

`dev.sh` expects a conda environment named `medease-backend`. If you don't have one yet, set it up first (see Backend Setup below), then run `./dev.sh`.

### Backend Setup

Python 3.12 is required — PyTorch is incompatible with 3.13.

```bash
# Option A: conda (preferred)
conda create -n medease-backend python=3.12
conda activate medease-backend
pip install -r backend/requirements.txt

# Option B: venv
python3.12 -m venv venv-fastapi
source venv-fastapi/bin/activate
pip install -r backend/requirements.txt
```

Copy `.env.example` to `backend/.env` and fill in the required values (see [Environment Variables](#environment-variables)).

```bash
# Run manually if not using dev.sh
cd backend
python -m uvicorn main:app --reload --port 8081
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run lint
```

---

## Multi-Agent Chat System

All chat flows through a pipeline: **Guardrail → Intent → Orchestrator → Specialist Agent**

```
User message (Socket.IO)
    │
    ▼
Guardrail Agent       ← safety filter, PII stripping
    │
    ▼
Intent Agent          ← classifies intent + confidence score
    │
    ▼
Orchestrator          ← routes to specialist; delegates to Triage if confidence < 0.65
    │
    ├── Triage Agent          (ambiguous input)
    ├── RAG Agent             (DAS FAQ, corpus Q&A)
    ├── Accommodation Agent   (letter generation)
    ├── Medication Agent      (medication Q&A)
    └── Caregiver Agent       (reminders, patient data)
```

Intent labels: `accommodation_request` · `das_faq` · `appointment_scheduling` · `medication_query` · `caregiver_query` · `reminder_request` · `general_chat` · `out_of_scope`

See [`docs/agent-architecture.md`](docs/agent-architecture.md) for full agent definitions, data contracts, and walkthrough examples.

### RAG Corpus Handoff

The RAG corpus is produced by **MedEase-Utils** (the scraper). To update it:

```bash
# 1. Run scraper in MedEase-Utils → produces emory_das_data_latest.json
# 2. Copy into the corpus directory:
cp ../MedEase-Utils/output/emory_das_data_latest.json backend/src/rag/corpus/

# 3. Re-index:
cd backend
python -m src.rag.indexer
```

Vector store persists at `backend/src/rag/chroma_store/`. Embeddings use `text-embedding-3-small`.

---

## API Routes

| Prefix | File | Purpose |
|--------|------|---------|
| `/auth` | `routes/auth.py` | Registration, login, JWT |
| `/medication` | `routes/medication.py` | Medication tracking |
| `/caregiver` | `routes/caregiver.py` | Caregiver/patient management |
| `/google` | `routes/google.py` | OAuth, Calendar, Gmail |
| `/simplify` | `routes/simplify.py` | AI document simplification |
| `/general` | `routes/general.py` | Utility endpoints |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `OPENAI_API_KEY` | OpenAI API key (chat + embeddings) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `AWS_S3_BUCKET` | S3 bucket name |
| MongoDB collection names | See `src/config.py` for full list |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

---

## Deployment

### Backend — Google Cloud App Engine

```bash
cd backend
gcloud app deploy app.yaml
```

Runtime: Python 3.12 · Flex environment · Port 8080 · `app.yaml` at `backend/app.yaml`.

### Frontend — Cloudflare Pages

Auto-deploys on push to `main` via GitHub Actions: `npm run build` → Cloudflare Pages (`medease` project).
