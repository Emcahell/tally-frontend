#!/usr/bin/env bash
# validate-skill.sh — Self-validation of the skill structure.
# Ensures the skill itself follows anti-tech-debt principles.
#
# Usage: ./validate-skill.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FAILURES=0

echo "=== Skill Self-Validation ==="
echo "Skill directory: $SKILL_DIR"
echo ""

# ─── 1. SKILL.md Exists ──────────────────────────────────────────────────────
echo -n "[SKILL.md exists] "
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL — SKILL.md not found${NC}"
  FAILURES=$((FAILURES+1))
fi

# ─── 2. Frontmatter Valid ────────────────────────────────────────────────────
echo -n "[frontmatter valid] "
if head -1 "$SKILL_DIR/SKILL.md" | grep -q "^---"; then
  # Extract frontmatter
  frontmatter=$(sed -n '/^---$/,/^---$/p' "$SKILL_DIR/SKILL.md" | sed '1d;$d')
  if echo "$frontmatter" | grep -q "^name:"; then
    echo -e "${GREEN}PASS${NC}"
  else
    echo -e "${RED}FAIL — missing 'name' in frontmatter${NC}"
    FAILURES=$((FAILURES+1))
  fi
else
  echo -e "${RED}FAIL — no YAML frontmatter (must start with ---)${NC}"
  FAILURES=$((FAILURES+1))
fi

# ─── 3. Name Matches Directory ───────────────────────────────────────────────
echo -n "[name matches dir] "
skill_name=$(sed -n '/^---$/,/^---$/p' "$SKILL_DIR/SKILL.md" | grep "^name:" | sed 's/^name: *//' | tr -d '"')
dirname=$(basename "$SKILL_DIR")
if [ "$skill_name" = "$dirname" ]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${YELLOW}WARN — name '$skill_name' != directory '$dirname'${NC}"
fi

# ─── 4. All Referenced Files Exist ───────────────────────────────────────────
echo -n "[references exist] "
missing=0
# Extract file references from SKILL.md (patterns like `references/foo.md`)
refs=$(grep -oE '(references|frameworks|checklists|scripts)/[a-zA-Z0-9._-]+' "$SKILL_DIR/SKILL.md" | sort -u)
for ref in $refs; do
  if [ ! -f "$SKILL_DIR/$ref" ]; then
    echo -e "${RED}FAIL — missing referenced file: $ref${NC}"
    missing=$((missing+1))
  fi
done
if [ "$missing" -eq 0 ]; then
  echo -e "${GREEN}PASS${NC}"
else
  FAILURES=$((FAILURES+missing))
fi

# ─── 5. All Framework Files Referenced ───────────────────────────────────────
echo -n "[frameworks exist] "
missing=0
for fw in react nextjs svelte sveltekit astro; do
  if [ ! -f "$SKILL_DIR/frameworks/$fw.md" ]; then
    echo -e "${RED}FAIL — missing frameworks/$fw.md${NC}"
    missing=$((missing+1))
  fi
done
if [ "$missing" -eq 0 ]; then
  echo -e "${GREEN}PASS${NC}"
else
  FAILURES=$((FAILURES+missing))
fi

# ─── 6. All Checklist Files Exist ────────────────────────────────────────────
echo -n "[checklists exist] "
missing=0
for cl in pre-implementation security-review accessibility-review performance-review production-validation definition-of-done; do
  if [ ! -f "$SKILL_DIR/checklists/$cl.md" ]; then
    echo -e "${RED}FAIL — missing checklists/$cl.md${NC}"
    missing=$((missing+1))
  fi
done
if [ "$missing" -eq 0 ]; then
  echo -e "${GREEN}PASS${NC}"
else
  FAILURES=$((FAILURES+missing))
fi

# ─── 7. Scripts Executable ───────────────────────────────────────────────────
echo -n "[scripts executable] "
non_exec=0
for script in "$SKILL_DIR"/scripts/*.sh; do
  if [ -f "$script" ] && [ ! -x "$script" ]; then
    echo -e "${RED}FAIL — not executable: $(basename "$script")${NC}"
    non_exec=$((non_exec+1))
  fi
done
if [ "$non_exec" -eq 0 ]; then
  echo -e "${GREEN}PASS${NC}"
else
  FAILURES=$((FAILURES+non_exec))
fi

# ─── 8. No Broken Internal Links ─────────────────────────────────────────────
echo -n "[no broken links] "
broken=0
# Check markdown links [text](path) where path is a local file
links=$(grep -oE '\]\(([^)]+\.md)\)' "$SKILL_DIR/SKILL.md" | sed 's/](//;s/)//' | sort -u || true)
for link in $links; do
  if [ ! -f "$SKILL_DIR/$link" ]; then
    echo -e "${RED}FAIL — broken link: $link${NC}"
    broken=$((broken+1))
  fi
done
if [ "$broken" -eq 0 ]; then
  echo -e "${GREEN}PASS${NC}"
else
  FAILURES=$((FAILURES+broken))
fi

# ─── 9. No Duplicate Rules Across Files ──────────────────────────────────────
echo -n "[no duplicate rules] "
# Simple heuristic: check for identical lines starting with "MUST" or "MUST NOT" across references
must_rules=$(grep -rhE '^\- MUST( NOT)? ' "$SKILL_DIR/references/" "$SKILL_DIR/frameworks/" 2>/dev/null | sort | uniq -d | head -5 || true)
if [ -n "$must_rules" ]; then
  echo -e "${YELLOW}WARN — potential duplicate MUST rules:${NC}"
  echo "$must_rules" | head -3
else
  echo -e "${GREEN}PASS${NC}"
fi

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "========================================"
if [ "$FAILURES" -eq 0 ]; then
  echo -e "  ${GREEN}SKILL VALIDATION PASSED${NC}"
  echo "========================================"
  exit 0
else
  echo -e "  ${RED}SKILL VALIDATION FAILED — $FAILURES issue(s)${NC}"
  echo "========================================"
  exit 1
fi
