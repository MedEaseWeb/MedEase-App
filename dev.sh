#!/usr/bin/env bash
# dev.sh — MedEase local development launcher
#
# Usage:
#   ./dev.sh             # start frontend + backend (default)
#   ./dev.sh backend     # start backend only
#   ./dev.sh frontend    # start frontend only

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
BACKEND_DIR="$REPO_ROOT/backend"
CONDA_ENV="medease-backend"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ── Helpers ────────────────────────────────────────────────────────────────

start_backend() {
    local stale
    stale=$(lsof -ti:8081 2>/dev/null) || true
    if [ -n "$stale" ]; then
        echo -e "${YELLOW}[backend]${NC}  Killing stale process on :8081 (PID $stale)"
        kill "$stale" 2>/dev/null
        sleep 0.5
    fi

    echo -e "${GREEN}[backend]${NC}  Activating conda env '${CONDA_ENV}' and starting uvicorn..."
    cd "$BACKEND_DIR"
    conda run -n "$CONDA_ENV" --no-capture-output python -m uvicorn main:app --reload --port 8081 &
    BACKEND_PID=$!
}

start_frontend() {
    echo -e "${CYAN}[frontend]${NC} Starting Vite dev server..."
    cd "$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
}

# ── Mode ───────────────────────────────────────────────────────────────────

MODE="${1:-both}"

case "$MODE" in
    both | "")
        cleanup() {
            echo -e "\n${YELLOW}Shutting down...${NC}"
            kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
            wait "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
            echo "Done."
        }
        trap cleanup INT TERM

        start_frontend
        start_backend

        echo ""
        echo -e "  ${CYAN}Frontend${NC}  →  http://localhost:5173"
        echo -e "  ${GREEN}Backend${NC}   →  http://localhost:8081"
        echo ""
        echo "Press Ctrl+C to stop both servers."
        wait
        ;;

    backend)
        trap 'echo -e "\n${YELLOW}Shutting down...${NC}"; echo "Done."' INT TERM
        start_backend
        echo -e "${GREEN}[backend]${NC}  →  http://localhost:8081"
        echo "Press Ctrl+C to stop."
        echo ""
        wait "$BACKEND_PID"
        ;;

    frontend)
        trap 'echo -e "\n${YELLOW}Shutting down...${NC}"; echo "Done."' INT TERM
        start_frontend
        echo -e "${CYAN}[frontend]${NC}  →  http://localhost:5173"
        echo "Press Ctrl+C to stop."
        echo ""
        wait "$FRONTEND_PID"
        ;;

    *)
        echo "Usage: $0 [both|backend|frontend]" >&2
        exit 1
        ;;
esac
