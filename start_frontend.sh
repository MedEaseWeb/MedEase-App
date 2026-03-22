#!/usr/bin/env bash
# start_frontend.sh — start MedEase frontend only
# Usage: ./start_frontend.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}[frontend]${NC}  Starting Vite dev server..."
echo -e "${CYAN}[frontend]${NC}  →  http://localhost:5173"
echo "Press Ctrl+C to stop."
echo ""

cd "$FRONTEND_DIR"
npm run dev
