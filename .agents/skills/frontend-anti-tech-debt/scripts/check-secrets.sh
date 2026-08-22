#!/usr/bin/env bash
# check-secrets.sh — Scan source code for leaked secrets.
# Exits 1 if any potential secret is found. NEVER exits 0 on detection.
#
# Usage: ./check-secrets.sh [directory]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

SEARCH_DIR="${1:-.}"
FOUND=0

echo "=== Secret Scanning ==="
echo "Scanning: $SEARCH_DIR"
echo ""

# Patterns that indicate secrets/credentials
PATTERNS=(
  # API keys (common prefixes)
  "sk_live_[a-zA-Z0-9]"
  "sk_test_[a-zA-Z0-9]"
  "pk_live_[a-zA-Z0-9]"
  "pk_test_[a-zA-Z0-9]"
  "sk-[a-zA-Z0-9]{20,}"
  "pk_[a-zA-Z0-9]{20,}"
  "AKIA[0-9A-Z]{16}"
  # Generic secret assignments (be conservative to avoid false positives)
  'secret\s*[:=]\s*["'"'"'][^"'"'"']{8,}'
  'password\s*[:=]\s*["'"'"'][^"'"'"']{8,}'
  'token\s*[:=]\s*["'"'"'][^"'"'"']{20,}'
  # Private keys
  "BEGIN (RSA |EC )?PRIVATE KEY"
  # AWS
  "aws_secret_access_key\s*[:=]"
)

# Directories to always skip
SKIP_DIRS="node_modules|.git|dist|.next|.output|build|coverage|vendor"

for pattern in "${PATTERNS[@]}"; do
  matches=$(grep -rniE "$pattern" \
    --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
    --include="*.svelte" --include="*.astro" --include="*.vue" \
    --include="*.html" --include="*.css" --include="*.json" \
    --include="*.yaml" --include="*.yml" --include="*.toml" \
    --include="*.sh" --include="*.env" --include="*.env.*" \
    "$SEARCH_DIR" 2>/dev/null \
    | grep -vE "($SKIP_DIRS)" \
    | grep -v "check-secrets" \
    | grep -v "SKILL.md" \
    | grep -v ".env.example" \
    | grep -v "package.json" \
    | grep -v "package-lock.json" \
    | grep -v "node_modules" \
    || true)

  if [ -n "$matches" ]; then
    if [ "$FOUND" -eq 0 ]; then
      echo -e "${RED}POTENTIAL SECRETS DETECTED:${NC}"
      echo ""
    fi
    echo -e "${RED}Pattern: $pattern${NC}"
    echo "$matches" | head -10
    echo ""
    FOUND=1
  fi
done

# Also check for .env files with non-example values
env_files=$(find "$SEARCH_DIR" -name ".env" -o -name ".env.local" -o -name ".env.production" -o -name ".env.staging" 2>/dev/null \
  | grep -v node_modules \
  | grep -v ".env.example" \
  | grep -v ".env.sample" || true)

if [ -n "$env_files" ]; then
  echo -e "${RED}Environment files found (verify they are not committed):${NC}"
  echo "$env_files"
  echo ""
  FOUND=1
fi

echo ""
if [ "$FOUND" -eq 1 ]; then
  echo -e "${RED}SECRET SCAN FAILED${NC}"
  echo -e "${RED}Review the findings above. Remove secrets from source code.${NC}"
  echo -e "${RED}Secrets MUST NOT appear in client bundle, git, logs, or error messages.${NC}"
  exit 1
else
  echo -e "${GREEN}SECRET SCAN PASSED${NC}"
  echo -e "${GREEN}No potential secrets detected in source code.${NC}"
  exit 0
fi
