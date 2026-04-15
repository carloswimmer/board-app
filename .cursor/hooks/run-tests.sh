#!/usr/bin/env bash
set -euo pipefail

# Always execute from repo root.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "[hook] Running validation on stop..."
pnpm lint
pnpm test:run
echo "[hook] Validation finished successfully."
