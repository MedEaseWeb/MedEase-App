#!/usr/bin/env bash
# start_backend.sh — start MedEase backend only
# Usage: ./start_backend.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
CONDA_ENV="medease-backend"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Free port 8081 if a stale process is holding it
STALE=$(lsof -ti:8081 2>/dev/null) || true
if [ -n "$STALE" ]; then
    echo -e "${YELLOW}[backend]${NC}  Killing stale process on :8081 (PID $STALE)"
    kill "$STALE" 2>/dev/null
    sleep 0.5
fi

echo -e "${GREEN}[backend]${NC}  Starting uvicorn in conda env '${CONDA_ENV}'..."
echo -e "${GREEN}[backend]${NC}  →  http://localhost:8081"
echo "Press Ctrl+C to stop."
echo ""

cd "$BACKEND_DIR"
conda run -n "$CONDA_ENV" --no-capture-output python -m uvicorn main:app --reload --port 8081
