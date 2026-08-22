#!/usr/bin/env bash
# check-production.sh — Validate production readiness.
# Exits 1 if any critical check fails.
#
# Detects project's actual build/test/lint commands from package.json.
# Does NOT use hardcoded fallbacks like `next lint` or `npm run build || npx next build`.

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

FAILURES=0
FAILED_CHECKS=()

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
    echo "npm"
  fi
}

PM=$(detect_package_manager)

# ─── Script helpers from package.json ─────────────────────────────────────────
get_script() {
  local name="$1"
  node -e "const p=require('./package.json'); console.log(p.scripts?.['$name'] || '')" 2>/dev/null || echo ""
}

HAS_SCRIPT() {
  local name="$1"
  local val
  val=$(get_script "$name")
  [ -n "$val" ]
}

# ─── Helper: run check and track failures ─────────────────────────────────────
run_check() {
  local name="$1"
  shift
  echo -n "[$name] "
  if "$@" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    FAILED_CHECKS+=("$name")
    FAILURES=$((FAILURES + 1))
    return 0
  fi
}

echo -e "${CYAN}=== Production Validation ===${NC}"
echo -e "${CYAN}Package manager: $PM${NC}"
echo ""

# ─── 1. Typecheck ─────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Typecheck ---${NC}"
if [ -f "tsconfig.json" ] || [ -f "tsconfig.app.json" ]; then
  run_check "typecheck" npx tsc --noEmit
else
  echo -e "${YELLOW}[typecheck] SKIP — no tsconfig${NC}"
fi

# ─── 2. Lint ──────────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Lint ---${NC}"
# Detect the actual lint command from the project — do NOT use `next lint`
LINT_SCRIPT=""
for candidate in lint "type-check" check; do
  val=$(get_script "$candidate")
  if [ -n "$val" ]; then
    LINT_SCRIPT="$candidate"
    break
  fi
done

if [ -n "$LINT_SCRIPT" ]; then
  run_check "lint" $PM run "$LINT_SCRIPT"
elif [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ] || [ -f "eslint.config.mjs" ]; then
  run_check "lint" npx eslint .
else
  echo -e "${YELLOW}[lint] SKIP — no lint config or script${NC}"
fi

# ─── 3. Unit Tests ────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Unit Tests ---${NC}"
TEST_SCRIPT=""
for candidate in test "test:unit"; do
  val=$(get_script "$candidate")
  if [ -n "$val" ]; then
    TEST_SCRIPT="$candidate"
    break
  fi
done

if [ -n "$TEST_SCRIPT" ]; then
  run_check "unit-tests" $PM run "$TEST_SCRIPT"
elif npx vitest --version > /dev/null 2>&1; then
  run_check "unit-tests" npx vitest run
elif npx jest --version > /dev/null 2>&1; then
  run_check "unit-tests" npx jest --passWithNoTests
else
  echo -e "${YELLOW}[unit-tests] SKIP — no test runner detected${NC}"
fi

# ─── 4. Production Build ─────────────────────────────────────────────────────
echo -e "${CYAN}--- Production Build ---${NC}"
BUILD_SCRIPT=$(get_script "build")
if [ -n "$BUILD_SCRIPT" ]; then
  # Use the project's EXACT build command — no fallbacks
  run_check "build" $PM run build
else
  echo -e "${YELLOW}[build] SKIP — no build script in package.json${NC}"
fi

# ─── 5. Secrets Check ────────────────────────────────────────────────────────
echo -e "${CYAN}--- Secret Scanning ---${NC}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/check-secrets.sh" ]; then
  if ! bash "$SCRIPT_DIR/check-secrets.sh" 2>/dev/null; then
    FAILED_CHECKS+=("secrets")
    FAILURES=$((FAILURES + 1))
    echo -e "${RED}[secrets] FAIL${NC}"
  else
    echo -e "${GREEN}[secrets] PASS${NC}"
  fi
else
  echo -e "${YELLOW}[secrets] SKIP — check-secrets.sh not found${NC}"
fi

# ─── 6. Source Maps in Build ─────────────────────────────────────────────────
echo -e "${CYAN}--- Source Maps ---${NC}"
echo -n "[source-maps] "
map_files=$(find .next dist build .output -name "*.map" 2>/dev/null | head -1 || true)
if [ -n "$map_files" ]; then
  echo -e "${YELLOW}WARNING — source maps in build output. Ensure they are not deployed to production.${NC}"
else
  echo -e "${GREEN}PASS${NC}"
fi

# ─── 7. Bundle Analysis ──────────────────────────────────────────────────────
echo -e "${CYAN}--- Bundle Budget ---${NC}"
echo -n "[bundle] "
if [ -f ".next/analyze/client.html" ] || [ -f "bundle-analysis.json" ] || [ -f "stats.json" ]; then
  echo -e "${GREEN}Bundle analysis available — review before merging${NC}"
else
  echo -e "${YELLOW}No bundle analysis found (run analyzer if needed)${NC}"
fi

# ─── 8. Dependency Audit ──────────────────────────────────────────────────────
echo -e "${CYAN}--- Dependency Audit ---${NC}"
if [ -f "$SCRIPT_DIR/check-dependencies.sh" ]; then
  if ! bash "$SCRIPT_DIR/check-dependencies.sh" 2>/dev/null; then
    FAILED_CHECKS+=("dependencies")
    FAILURES=$((FAILURES + 1))
    echo -e "${RED}[dependencies] FAIL${NC}"
  else
    echo -e "${GREEN}[dependencies] PASS${NC}"
  fi
fi

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "========================================"
if [ "$FAILURES" -eq 0 ]; then
  echo -e "  ${GREEN}PRODUCTION VALIDATION PASSED${NC}"
  echo "========================================"
  exit 0
else
  echo -e "  ${RED}PRODUCTION VALIDATION FAILED — $FAILURES issue(s)${NC}"
  echo "========================================"
  echo ""
  echo -e "  ${RED}Failed checks:${NC}"
  for check in "${FAILED_CHECKS[@]}"; do
    echo -e "    ${RED}✗ $check${NC}"
  done
  echo ""
  echo -e "  ${RED}Do NOT deploy. Fix all failures.${NC}"
  exit 1
fi
