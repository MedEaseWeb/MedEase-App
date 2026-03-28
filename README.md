<div align="center">

<img src="frontend/public/medease-logo.svg" alt="MedEase Logo" width="90" />

**MedEase: Agentic AI for your post-injury journey**

</div>

We replace post-injury panic with precision by intelligently triaging you to the correct care and campus resources based on your university's specific data.

<div align="center">
  
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

[![Cloudflare Pages](https://img.shields.io/badge/Frontend-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Google Cloud](https://img.shields.io/badge/Backend-Google_Cloud_App_Engine-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/appengine)

</div>

>[!NOTE]
>This is the dev repo for this project. For administrative/contextual information, see [MedEaseWeb/MedEase-Meta](https://github.com/MedEaseWeb/MedEase-Meta)


### Architecture

<details>
<summary><b>Agent Architecture</b></summary>
MedEase uses a multi-agent pipeline over Socket.IO. Every message passes through a guardrail and intent classifier before being routed to the right specialist agent.

```
User message (Socket.IO)
        │
        ▼
  Guardrail Agent        ← safety filter, PII stripping
        │
        ▼
  Intent Agent           ← classifies intent + confidence score
        │
        ▼
  Orchestrator           ← routes to specialist; falls back to Triage if confidence < 0.65
        │
   ┌────┴──────────────────────────────────────┐
   ▼              ▼              ▼              ▼
Triage         RAG Agent    Accommodation   Medication /
Agent          (DAS Q&A)    Letter Agent    Caregiver Agents
                   │
                   ▼
             ChromaDB
         (Emory DAS corpus)
```
</details>

<details>
<summary><b>Agent details</b></summary>

| Agent | File | Role |
|-------|------|------|
| Guardrail | `src/agents/guardrail_agent.py` | Blocks jailbreaks, harmful content, strips PII |
| Intent | `src/agents/intent_agent.py` | GPT classifier — 8 intent labels + confidence score |
| Orchestrator | `src/agents/orchestrator.py` | Central router; manages session context across handoffs |
| Triage | `src/agents/triage_agent.py` | Asks one clarifying question when intent is ambiguous |
| RAG | `src/agents/rag_agent.py` | DAS Q&A grounded in ChromaDB vector store |
| Accommodation | `src/agents/accommodation_agent.py` | Multi-turn letter generator |
| Medication | `src/agents/medication_agent.py` | Medication Q&A |
| Caregiver | `src/agents/caregiver_agent.py` | Reminders + patient data via Google Calendar |

Intent labels: `accommodation_request` · `das_faq` · `appointment_scheduling` · `medication_query` · `caregiver_query` · `reminder_request` · `general_chat` · `out_of_scope`

See [`docs/agent-architecture.md`](docs/agent-architecture.md) for full data contracts and walkthrough examples.

</details>

<details>
<summary><b>RAG pipeline</b></summary>

- **Corpus:** Emory DAS documents scraped by [MedEase-Utils](../MedEase-Utils/), chunked into text segments
- **Embeddings:** `text-embedding-3-small` (OpenAI)
- **Vector store:** ChromaDB — local, persistent at `backend/src/rag/chroma_store/`
- **Retrieval:** top-k cosine similarity → injected into GPT context

To update the corpus after a new scraper run:

```bash
cp ../MedEase-Utils/output/emory_das_data_latest.json backend/src/rag/corpus/
cd backend && python -m src.rag.indexer
```

</details>

---

### Getting Started

### Prerequisites

- Python 3.12 (required — PyTorch incompatible with 3.13)
- Node.js 18+
- conda (recommended) or venv
- A `backend/.env` file (see [Environment Variables](#environment-variables))

### Quick Start

**Option A — Docker (recommended)**

```bash
git clone https://github.com/MedEaseWeb/MedEase-App.git
cd MedEase-App

# Fill in backend secrets
cp backend/.env.example backend/.env

docker compose up --build
```

| URL | Service |
|-----|---------|
| `http://localhost:5173` | Frontend |
| `http://localhost:8081` | Backend API |

**Option B — Local dev**

```bash
# Set up the backend environment
conda create -n medease-backend python=3.12
conda activate medease-backend
pip install -r backend/requirements.txt

# Set up the frontend
cd frontend && npm install && cd ..

# Copy and fill in environment variables
cp backend/.env.example backend/.env

# Start everything
./dev.sh
```

| Command | Description |
|---------|-------------|
| `./dev.sh` | Start frontend + backend |
| `./dev.sh backend` | Backend only → `http://localhost:8081` |
| `./dev.sh frontend` | Frontend only → `http://localhost:5173` |

<details>
<summary><b>Project structure</b></summary>

```
MedEase-App/
├── docker-compose.yml     # Local dev: frontend + backend
├── frontend/              # React/Vite SPA
│   ├── Dockerfile         # Multi-stage: Node build → nginx serve
│   ├── nginx.conf         # try_files for React Router
│   ├── src/
│   │   ├── pages/         # LandingPage, auth, medication, careGiver, utility
│   │   └── context/       # AuthContext (JWT + user state)
│   └── public/
├── backend/               # FastAPI backend
│   ├── Dockerfile         # python:3.12-slim, torch CPU-only
│   ├── main.py            # Entry point; mounts 6 routers + Socket.IO
│   ├── app.yaml           # GCP Cloud Run config
│   ├── requirements.txt
│   └── src/
│       ├── agents/        # Multi-agent pipeline
│       ├── rag/           # Indexer, retriever, ChromaDB
│       ├── routes/        # auth, medication, caregiver, google, simplify, general
│       ├── services/      # Simplification + classification logic
│       ├── models/        # Pydantic v2 schemas
│       └── config.py      # Loads secrets from .env
└── docs/
    └── agent-architecture.md
```

</details>

---

### Environment Variables

<details>
<summary><b>Backend (<code>backend/.env</code>)</b></summary>

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

See `backend/src/config.py` for the full list including MongoDB collection name vars.

</details>

<details>
<summary><b>Frontend (<code>frontend/.env</code>)</b></summary>

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

</details>

---

### Deployment

<details>
<summary><b>Backend — Google Cloud Run</b></summary>

```bash
gcloud run deploy medease-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Then set env vars:

```bash
gcloud run services update medease-backend \
  --set-env-vars MONGO_URI=...,SECRET_KEY=...,CHAT_GPT_API_KEY=... \
  --region us-central1
```

Runtime: Python 3.12 · Cloud Run · Port 8080

</details>

<details>
<summary><b>Frontend — Cloudflare Pages</b></summary>

Auto-deploys on push to `main` via GitHub Actions: `npm run build` → Cloudflare Pages project `medease`.

</details>

---

<div align="center">

Built with care for Emory students navigating DAS · [MedEaseWeb](https://github.com/MedEaseWeb)

</div>
