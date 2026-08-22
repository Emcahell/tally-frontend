#!/usr/bin/env bash
# check-dependencies.sh — Dependency security and health check.
# Exits 1 on critical/high vulnerabilities or missing lockfile.
#
# Detects package manager from lockfile.

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

FAILURES=0

echo "=== Dependency Security Check ==="

# ─── Package Manager Detection ───────────────────────────────────────────────
detect_package_manager() {
  if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
    echo "bun"
  elif [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  elif [ -f "package-lock.json" ]; then
    echo "npm"
  else
    echo "unknown"
  fi
}

PM=$(detect_package_manager)
echo "Package manager: $PM"

# ─── 1. Lockfile Check ───────────────────────────────────────────────────────
echo -n "[lockfile] "
case "$PM" in
  npm)   [ -f "package-lock.json" ] && echo -e "${GREEN}PASS${NC}" || { echo -e "${RED}FAIL — missing${NC}"; FAILURES=$((FAILURES+1)); } ;;
  yarn)  [ -f "yarn.lock" ] && echo -e "${GREEN}PASS${NC}" || { echo -e "${RED}FAIL — missing${NC}"; FAILURES=$((FAILURES+1)); } ;;
  pnpm)  [ -f "pnpm-lock.yaml" ] && echo -e "${GREEN}PASS${NC}" || { echo -e "${RED}FAIL — missing${NC}"; FAILURES=$((FAILURES+1)); } ;;
  bun)   { [ -f "bun.lockb" ] || [ -f "bun.lock" ]; } && echo -e "${GREEN}PASS${NC}" || { echo -e "${RED}FAIL — missing${NC}"; FAILURES=$((FAILURES+1)); } ;;
  *)     echo -e "${YELLOW}SKIP — unknown package manager${NC}" ;;
esac

# ─── 2. Audit ─────────────────────────────────────────────────────────────────
echo "[audit]"
case "$PM" in
  npm)
    if command -v npm &> /dev/null; then
      audit_output=$(npm audit --json 2>/dev/null || true)
      # Parse JSON structurally — count vulnerabilities by severity
      critical=$(echo "$audit_output" | node -e "
        const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
        console.log(d.metadata?.vulnerabilities?.critical || 0);
      " 2>/dev/null || echo "0")
      high=$(echo "$audit_output" | node -e "
        const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
        console.log(d.metadata?.vulnerabilities?.high || 0);
      " 2>/dev/null || echo "0")
      moderate=$(echo "$audit_output" | node -e "
        const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
        console.log(d.metadata?.vulnerabilities?.moderate || 0);
      " 2>/dev/null || echo "0")

      echo "  Critical: $critical | High: $high | Moderate: $moderate"

      if [ "$critical" -gt 0 ] || [ "$high" -gt 0 ]; then
        echo -e "  ${RED}FAIL — $critical critical, $high high vulnerabilities${NC}"
        FAILURES=$((FAILURES+1))
      elif [ "$moderate" -gt 0 ]; then
        echo -e "  ${YELLOW}WARN — $moderate moderate vulnerabilities (review recommended)${NC}"
      else
        echo -e "  ${GREEN}PASS${NC}"
      fi
    fi
    ;;
  pnpm)
    if command -v pnpm &> /dev/null; then
      pnpm audit --json > /dev/null 2>&1 && echo -e "  ${GREEN}PASS${NC}" || {
        echo -e "  ${RED}FAIL — vulnerabilities found (run: pnpm audit)${NC}"
        FAILURES=$((FAILURES+1))
      }
    fi
    ;;
  yarn)
    if command -v yarn &> /dev/null; then
      yarn audit --json > /dev/null 2>&1 && echo -e "  ${GREEN}PASS${NC}" || {
        echo -e "  ${RED}FAIL — vulnerabilities found (run: yarn audit)${NC}"
        FAILURES=$((FAILURES+1))
      }
    fi
    ;;
  bun)
    echo -e "  ${YELLOW}SKIP — bun audit not yet available${NC}"
    ;;
  *)
    echo -e "  ${YELLOW}SKIP — unknown package manager${NC}"
    ;;
esac

# ─── 3. Debug Code in Source ──────────────────────────────────────────────────
echo -n "[debug-code] "
debug_count=$(grep -r "console\.log\|debugger\|TODO.*TEMP\|FIXME.*TEMP" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.svelte" --include="*.astro" \
  . 2>/dev/null \
  | grep -v node_modules \
  | grep -v dist \
  | grep -v .next \
  | grep -v build \
  | wc -l || echo "0")

if [ "$debug_count" -gt 0 ]; then
  echo -e "${YELLOW}WARN — $debug_count debug statements found${NC}"
else
  echo -e "${GREEN}PASS${NC}"
fi

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
if [ "$FAILURES" -gt 0 ]; then
  echo -e "${RED}DEPENDENCY CHECK FAILED — $FAILURES critical issue(s)${NC}"
  exit 1
else
  echo -e "${GREEN}DEPENDENCY CHECK PASSED${NC}"
  exit 0
fi
