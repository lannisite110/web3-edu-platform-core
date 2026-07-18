#!/usr/bin/env bash
# LabWeave environment doctor — checks repos, deps, ports, registry.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-..}"
PLUGINS_ABS="$(cd "${ROOT}/${PLUGINS_DIR}" 2>/dev/null && pwd)" || PLUGINS_ABS="${ROOT}/${PLUGINS_DIR}"

PASS=0
WARN=0
FAIL=0

ok()   { echo "  [OK]   $*"; PASS=$((PASS + 1)); }
warn() { echo "  [WARN] $*"; WARN=$((WARN + 1)); }
bad()  { echo "  [FAIL] $*"; FAIL=$((FAIL + 1)); }

check_cmd() {
  if command -v "$1" >/dev/null 2>&1; then ok "$1: $($1 --version 2>&1 | head -1)"
  else bad "$1 not found"; fi
}

port_free() {
  local p="$1"
  if fuser "${p}/tcp" >/dev/null 2>&1; then warn "port $p in use (labweave may already run)"
  else ok "port $p free"; fi
}

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  LabWeave Doctor                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo "CORE_ROOT=$ROOT"
echo "PLUGINS_DIR=$PLUGINS_ABS"
echo ""

echo "==> toolchain"
check_cmd go
check_cmd node
check_cmd npm
check_cmd python3
check_cmd curl
command -v kubectl >/dev/null 2>&1 && ok "kubectl: $(kubectl version --client -o yaml 2>/dev/null | grep gitVersion | head -1 || echo present)" || warn "kubectl not installed (optional for K8s)"

echo ""
echo "==> sibling repos"
for repo in web3-hot-topic-labs supervision-trace-edu-suite enterprise-gov-edu-demo global-social-edu-sandbox; do
  if [ -d "${PLUGINS_ABS}/${repo}/.git" ] || [ -d "${PLUGINS_ABS}/${repo}" ]; then
    ok "$repo present"
  else
    bad "missing ${PLUGINS_ABS}/${repo}"
  fi
done

echo ""
echo "==> python venv"
if [ -x "${ROOT}/.venv/bin/python" ]; then ok ".venv ready"
else warn ".venv missing — run: python3 -m venv .venv && .venv/bin/pip install -r rule-engine-py/requirements.txt"; fi

echo ""
echo "==> frontend node_modules"
if [ -d "${ROOT}/frontend-web/node_modules" ]; then ok "node_modules present"
else warn "run: cd frontend-web && npm ci"; fi

echo ""
echo "==> plugin registry"
REG="${ROOT}/frontend-web/src/plugins/plugins.registry.json"
if [ -f "$REG" ]; then
  COUNT=$(python3 -c "import json; print(len(json.load(open('${REG}'))))")
  if [ "${COUNT:-0}" -ge 20 ]; then ok "registry: ${COUNT} plugins"
  else warn "registry: ${COUNT} plugins (expected ~23) — run make register-plugins"; fi
else
  warn "no registry — run make register-plugins PLUGINS_DIR=.."
fi

echo ""
echo "==> ports (dev)"
port_free 5173
port_free 8080
port_free 8081
port_free 8082
port_free 8084

echo ""
echo "==> health (if stack running)"
for url in \
  "http://127.0.0.1:8081/health rule-engine" \
  "http://127.0.0.1:8082/health scheduler" \
  "http://127.0.0.1:8080/health gateway" \
  "http://127.0.0.1:8084/health agent-assist" \
  "http://127.0.0.1:5173/ frontend"; do
  set -- $url
  if curl -sf "$1" >/dev/null 2>&1; then ok "$2 responding at $1"
  else warn "$2 not up at $1"; fi
done

echo ""
echo "──────────────────────────────────────────────────────────────"
echo "Summary: OK=$PASS  WARN=$WARN  FAIL=$FAIL"
if [ "$FAIL" -gt 0 ]; then
  echo "Doctor: FAILED — fix [FAIL] items before deploy"
  exit 1
fi
echo "Doctor: PASSED (warnings are OK for first-time setup)"
exit 0
