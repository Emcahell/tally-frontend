#!/usr/bin/env bash
# validate.sh — Full validation pipeline for frontend projects.
# Exits with code 1 if ANY check fails. Never silently continues.
#
# Usage: ./validate.sh [--skip-e2e] [--skip-a11y]
#
# Detects package manager from lockfile. Uses project's actual scripts.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SKIP_E2E=false
SKIP_A11Y=false
FAILURES=0
FAILED_CHECKS=()

for arg in "$@"; do
  case $arg in
    --skip-e2e) SKIP_E2E=true ;;
    --skip-a11y) SKIP_A11Y=true ;;
  esac
done

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
    echo "npm" # fallback
  fi
}

PM=$(detect_package_manager)
echo -e "${CYAN}Detected package manager: ${PM}${NC}"

# Detect build command from package.json
BUILD_CMD=""
if [ -f "package.json" ]; then
  BUILD_CMD=$(node -e "const p=require('./package.json'); console.log(p.scripts?.build || '')" 2>/dev/null || echo "")
fi

if [ -z "$BUILD_CMD" ]; then
  echo -e "${YELLOW}No build script found in package.json — skipping build check${NC}"
fi

# Detect lint command from project config
LINT_CMD=""
if [ -f "package.json" ]; then
  # Check for lint scripts in order of preference
  for script in lint "type-check" check; do
    candidate=$(node -e "const p=require('./package.json'); console.log(p.scripts?.['$script'] || '')" 2>/dev/null || echo "")
    if [ -n "$candidate" ]; then
      LINT_CMD="$PM run $script"
      break
    fi
  done
fi

# Detect test command
TEST_CMD=""
if [ -f "package.json" ]; then
  for script in test "test:unit"; do
    candidate=$(node -e "const p=require('./package.json'); console.log(p.scripts?.['$script'] || '')" 2>/dev/null || echo "")
    if [ -n "$candidate" ] && echo "$candidate" | grep -q vitest 2>/dev/null; then
      TEST_CMD="$PM run $script"
      break
    fi
  done
  if [ -z "$TEST_CMD" ]; then
    for script in test "test:unit"; do
      candidate=$(node -e "const p=require('./package.json'); console.log(p.scripts?.['$script'] || '')" 2>/dev/null || echo "")
      if [ -n "$candidate" ]; then
        TEST_CMD="$PM run $script"
        break
      fi
    done
  fi
fi

echo ""
echo "========================================"
echo "  Frontend Validation Pipeline"
echo "  Package manager: $PM"
echo "========================================"
echo ""

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
    return 0  # don't exit — aggregate all failures
  fi
}

# ─── 1. Typecheck ─────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Typecheck ---${NC}"
if [ -f "tsconfig.json" ] || [ -f "tsconfig.app.json" ]; then
  run_check "typecheck" npx tsc --noEmit
else
  echo -e "${YELLOW}[typecheck] SKIP — no tsconfig.json found${NC}"
fi

# ─── 2. Lint ──────────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Lint ---${NC}"
if [ -n "$LINT_CMD" ]; then
  run_check "lint" bash -c "$LINT_CMD"
else
  # Fallback: try eslint if config exists
  if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ] || [ -f "eslint.config.mjs" ]; then
    run_check "lint" npx eslint . --max-warnings 0
  else
    echo -e "${YELLOW}[lint] SKIP — no lint config or script found${NC}"
  fi
fi

# ─── 3. Unit Tests ────────────────────────────────────────────────────────────
echo -e "${CYAN}--- Unit Tests ---${NC}"
if [ -n "$TEST_CMD" ]; then
  run_check "unit-tests" bash -c "$TEST_CMD"
elif command -v npx &> /dev/null; then
  # Try vitest then jest
  if npx vitest --version > /dev/null 2>&1; then
    run_check "unit-tests" npx vitest run
  elif npx jest --version > /dev/null 2>&1; then
    run_check "unit-tests" npx jest --passWithNoTests
  else
    echo -e "${YELLOW}[unit-tests] SKIP — no test runner detected${NC}"
  fi
else
  echo -e "${YELLOW}[unit-tests] SKIP — no test command found${NC}"
fi

# ─── 4. Production Build ─────────────────────────────────────────────────────
echo -e "${CYAN}--- Production Build ---${NC}"
if [ -n "$BUILD_CMD" ]; then
  run_check "build" $PM run build
else
  echo -e "${YELLOW}[build] SKIP — no build script in package.json${NC}"
fi

# ─── 5. E2E Tests ────────────────────────────────────────────────────────────
if [ "$SKIP_E2E" = false ]; then
  echo -e "${CYAN}--- E2E Tests ---${NC}"
  if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ] || [ -f "playwright.config.mjs" ]; then
    run_check "e2e" npx playwright test
  elif [ -f "cypress.config.ts" ] || [ -f "cypress.config.js" ]; then
    run_check "e2e" npx cypress run
  else
    echo -e "${YELLOW}[e2e] SKIP — no E2E config found${NC}"
  fi
else
  echo -e "${YELLOW}[e2e] SKIP (--skip-e2e)${NC}"
fi

# ─── 6. Secret Scanning ──────────────────────────────────────────────────────
echo -e "${CYAN}--- Secret Scanning ---${NC}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/check-secrets.sh" ]; then
  if ! bash "$SCRIPT_DIR/check-secrets.sh"; then
    FAILED_CHECKS+=("secrets")
    FAILURES=$((FAILURES + 1))
  fi
else
  # Inline fallback
  run_check "secrets" bash -c '
    grep -r "sk-\|pk_\|AKIA\|secret.*=.*[\"'"'"']" \
      --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
      --include="*.svelte" --include="*.astro" --include="*.env*" \
      . 2>/dev/null | grep -v node_modules | grep -v dist | grep -v .next | grep -v .env.example | grep -v SKILL.md | grep -v check-secrets | head -1 | grep -q .
  '
fi

# ─── 7. Accessibility (optional) ─────────────────────────────────────────────
if [ "$SKIP_A11Y" = false ]; then
  echo -e "${CYAN}--- Accessibility ---${NC}"
  # Only check if axe or similar is available
  if npx @axe-core/cli --version > /dev/null 2>&1; then
    run_check "a11y" npx @axe-core/cli --exit
  else
    echo -e "${YELLOW}[a11y] SKIP — @axe-core/cli not installed${NC}"
  fi
else
  echo -e "${YELLOW}[a11y] SKIP (--skip-a11y)${NC}"
fi

# ─── 8. Dependency Audit ──────────────────────────────────────────────────────
echo -e "${CYAN}--- Dependency Audit ---${NC}"
if [ -f "$SCRIPT_DIR/check-dependencies.sh" ]; then
  if ! bash "$SCRIPT_DIR/check-dependencies.sh"; then
    FAILED_CHECKS+=("dependencies")
    FAILURES=$((FAILURES + 1))
  fi
fi

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "========================================"
if [ "$FAILURES" -eq 0 ]; then
  echo -e "  ${GREEN}ALL CHECKS PASSED${NC}"
  echo "========================================"
  exit 0
else
  echo -e "  ${RED}VALIDATION FAILED — $FAILURES check(s) failed${NC}"
  echo "========================================"
  echo ""
  echo -e "  ${RED}Failed checks:${NC}"
  for check in "${FAILED_CHECKS[@]}"; do
    echo -e "    ${RED}✗ $check${NC}"
  done
  echo ""
  echo -e "  ${RED}The agent MUST NOT claim completion.${NC}"
  echo -e "  ${RED}Fix all failures before proceeding.${NC}"
  exit 1
fi
