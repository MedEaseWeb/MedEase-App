#!/usr/bin/env bash
# start.sh — spin up MedEase frontend + backend for local development
# Usage: ./start.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
BACKEND_DIR="$REPO_ROOT/backend"
CONDA_ENV="medease-backend"

# ── Colours ────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ── Cleanup on exit ────────────────────────────────────────────────────────
cleanup() {
    echo -e "\n${YELLOW}Shutting down...${NC}"
    kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
    echo "Done."
}
trap cleanup INT TERM

# ── Frontend ───────────────────────────────────────────────────────────────
echo -e "${CYAN}[frontend]${NC} Starting Vite dev server..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# ── Backend ────────────────────────────────────────────────────────────────
echo -e "${GREEN}[backend]${NC}  Activating conda env '${CONDA_ENV}' and starting uvicorn..."

# Free port 8081 if a stale process is holding it
STALE=$(lsof -ti:8081 2>/dev/null) || true
if [ -n "$STALE" ]; then
    echo -e "${YELLOW}[backend]${NC}  Killing stale process on :8081 (PID $STALE)"
    kill "$STALE" 2>/dev/null
    sleep 0.5
fi

cd "$BACKEND_DIR"
conda run -n "$CONDA_ENV" --no-capture-output python -m uvicorn main:app --reload --port 8081 &
BACKEND_PID=$!

# ── Status ─────────────────────────────────────────────────────────────────
echo ""
echo -e "  ${CYAN}Frontend${NC}  →  http://localhost:5173"
echo -e "  ${GREEN}Backend${NC}   →  http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
