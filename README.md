<div align="center">

<img src="frontend/public/medease-logo.svg" alt="MedEase Logo" width="120" />

# MedEase

**An accessibility-focused healthcare assistant for Emory students**

Simplify your DAS accommodation journey — from documentation to letters to Q&A, all in one place.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)

[![Cloudflare Pages](https://img.shields.io/badge/Frontend-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Google Cloud](https://img.shields.io/badge/Backend-Google_Cloud_App_Engine-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/appengine)

</div>

---

## What is MedEase?

MedEase helps Emory students with disabilities navigate the Disability and Accessibility Services (DAS) process — without phone calls, confusing forms, or walls of institutional text.

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Agent Chat** | RAG-powered assistant that triages your question to the right specialist agent |
| 📄 **Accommodation Letters** | Generate DAS accommodation letters in seconds |
| 💊 **Medication Tracking** | Log and query your medications via natural language |
| 📋 **Report Simplification** | AI-powered simplification of complex medical documents |
| 👨‍👩‍👧 **Caregiver Dashboard** | Let caregivers and family stay informed and set reminders |
| 🔍 **DAS Q&A** | Grounded answers from the Emory DAS corpus — no hallucinations |

---

## Demo

> [!NOTE]
> Screenshots and demo GIFs go here. Drop them in `docs/assets/` and update the links below.

<!--
<div align="center">
  <img src="docs/assets/chat-demo.gif" alt="MedEase Chat Demo" width="80%" />
  <br/>
  <img src="docs/assets/dashboard-screenshot.png" alt="Caregiver Dashboard" width="80%" />
</div>
-->

---

## Architecture

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

## Getting Started

### Prerequisites

- Python 3.12 (required — PyTorch incompatible with 3.13)
- Node.js 18+
- conda (recommended) or venv
- A `backend/.env` file (see [Environment Variables](#environment-variables))

### Quick Start

```bash
# Clone the repo
git clone https://github.com/MedEaseWeb/MedEase-App.git
cd MedEase-App

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
├── frontend/              # React/Vite SPA
│   ├── src/
│   │   ├── pages/         # LandingPage, auth, medication, careGiver, utility
│   │   └── context/       # AuthContext (JWT + user state)
│   └── public/
├── backend/               # FastAPI backend
│   ├── main.py            # Entry point; mounts 6 routers + Socket.IO
│   ├── app.yaml           # GCP App Engine config
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

## Environment Variables

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

## Deployment

<details>
<summary><b>Backend — Google Cloud App Engine</b></summary>

```bash
cd backend
gcloud app deploy app.yaml
```

Runtime: Python 3.12 · Flex environment · Port 8080

</details>

<details>
<summary><b>Frontend — Cloudflare Pages</b></summary>

Auto-deploys on push to `main` via GitHub Actions: `npm run build` → Cloudflare Pages project `medease`.

</details>

---

<div align="center">

Built with care for Emory students navigating DAS · [MedEaseWeb](https://github.com/MedEaseWeb)

</div>
