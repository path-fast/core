#!/usr/bin/env bash
set -euo pipefail

mkdir -p "$HOME"

export PNPM_HOME="${PNPM_HOME:-$HOME/.local/share/pnpm}"
export PNPM_STORE_DIR="${PNPM_STORE_DIR:-$PNPM_HOME/store}"
export PATH="$PNPM_HOME:$PATH"
mkdir -p "$PNPM_HOME" "$PNPM_STORE_DIR"

cd /app

pnpm install --frozen-lockfile
pnpm build
pnpm link --global

mkdir -p "$HOME/.path-fast"
printf '%s\n' '{"command":"code ."}' > "$HOME/.path-fast/ide-config.json"

cat > "$HOME/.bashrc" <<EOF
export PNPM_HOME="$PNPM_HOME"
export PATH="$PNPM_HOME:/opt/pf-mocks/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
EOF

exec "$@"
