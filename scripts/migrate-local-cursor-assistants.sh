#!/usr/bin/env bash
# Migrate local Cursor skills into the right git repo.
# Policy: knowledge-base/assistants-placement.md
#
# Usage:
#   ./scripts/migrate-local-cursor-assistants.sh              # dry-run
#   ./scripts/migrate-local-cursor-assistants.sh --apply       # copy files
#   AGENT_ROOT=... COPILOT_ROOT=... ./scripts/migrate-local-cursor-assistants.sh --apply
#
# Does NOT commit or push. Does NOT touch User Rules (Settings).

set -euo pipefail

APPLY=0
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_ROOT="${AGENT_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
COPILOT_ROOT="${COPILOT_ROOT:-$HOME/product-copilot}"

# Common alternate paths if default missing
if [[ ! -d "$COPILOT_ROOT/.git" ]]; then
  for cand in \
    "$HOME/Projects/product-copilot" \
    "$HOME/projects/product-copilot" \
    "$HOME/src/product-copilot" \
    "$HOME/Developer/product-copilot" \
    "$(dirname "$AGENT_ROOT")/product-copilot"
  do
    if [[ -d "$cand/.git" ]]; then
      COPILOT_ROOT="$cand"
      break
    fi
  done
fi

LOCAL_DIRS=()
[[ -d "$HOME/.cursor/skills" ]] && LOCAL_DIRS+=("$HOME/.cursor/skills")
[[ -d "$HOME/.agents/skills" ]] && LOCAL_DIRS+=("$HOME/.agents/skills")

PRODUCT_RE='(product|pmbok|pm-|[-_]pm$|^pm$|prd|roadmap|discovery|stakeholder|interview|backlog|icp|jtbd|opportunity|hypothesis|jobs-to-be|product-map|copilot)'
AGENT_RE='(muster|vibecoder|next|react|tailwind|shadcn|devops|deploy|qa|tdd|debug|lint|vercel|drizzle|posthog|quiet-partner|banya)'

classify() {
  local name="$1"
  local lower
  lower=$(echo "$name" | tr '[:upper:]' '[:lower:]')
  if echo "$lower" | grep -Eqi "$PRODUCT_RE"; then
    echo "product-copilot"
  elif echo "$lower" | grep -Eqi "$AGENT_RE"; then
    echo "Agent"
  else
    echo "ask"
  fi
}

echo "=== Cursor local skills → git (policy: assistants-placement.md) ==="
echo "Agent root:    $AGENT_ROOT"
echo "Copilot root:  $COPILOT_ROOT"
echo "Mode:          $([[ $APPLY -eq 1 ]] && echo APPLY || echo DRY-RUN)"
echo

if [[ ${#LOCAL_DIRS[@]} -eq 0 ]]; then
  echo "No local skill dirs found:"
  echo "  ~/.cursor/skills"
  echo "  ~/.agents/skills"
  echo
  echo "Nothing to migrate. If skills live only in User Rules / another path, copy manually."
  echo "User Rules stay in Cursor Settings (not this script)."
  exit 0
fi

AGENT_SKILLS="$AGENT_ROOT/.cursor/skills"
COPILOT_SKILLS="$COPILOT_ROOT/.cursor/skills"

if [[ $APPLY -eq 1 ]]; then
  mkdir -p "$AGENT_SKILLS"
  if [[ -d "$COPILOT_ROOT/.git" ]]; then
    mkdir -p "$COPILOT_SKILLS"
  fi
fi

copied_agent=0
copied_copilot=0
ask_count=0
skipped=0

for root in "${LOCAL_DIRS[@]}"; do
  echo "--- Scanning: $root ---"
  # Only top-level skill folders (dir containing SKILL.md or any dir)
  shopt -s nullglob
  for skill_path in "$root"/*/; do
    [[ -d "$skill_path" ]] || continue
    name="$(basename "$skill_path")"
    target="$(classify "$name")"
    has_skill_md="no"
    [[ -f "$skill_path/SKILL.md" ]] && has_skill_md="yes"

    case "$target" in
      product-copilot)
        if [[ ! -d "$COPILOT_ROOT/.git" ]]; then
          echo "  [SKIP] $name → product-copilot (repo not found at $COPILOT_ROOT)"
          echo "         Set COPILOT_ROOT=/path/to/product-copilot and re-run."
          skipped=$((skipped + 1))
          continue
        fi
        dest="$COPILOT_SKILLS/$name"
        echo "  [→ product-copilot] $name  (SKILL.md=$has_skill_md)"
        if [[ $APPLY -eq 1 ]]; then
          rm -rf "$dest"
          cp -R "$skill_path" "$dest"
          copied_copilot=$((copied_copilot + 1))
        fi
        ;;
      Agent)
        dest="$AGENT_SKILLS/$name"
        echo "  [→ Agent]           $name  (SKILL.md=$has_skill_md)"
        if [[ $APPLY -eq 1 ]]; then
          rm -rf "$dest"
          cp -R "$skill_path" "$dest"
          copied_agent=$((copied_agent + 1))
        fi
        ;;
      ask)
        echo "  [ASK]               $name  — ambiguous; decide manually:"
        echo "                      product-copilot OR Agent (.cursor/skills/$name)"
        ask_count=$((ask_count + 1))
        ;;
    esac
  done
  shopt -u nullglob
done

echo
echo "=== Summary ==="
if [[ $APPLY -eq 1 ]]; then
  echo "Copied to Agent:           $copied_agent"
  echo "Copied to product-copilot: $copied_copilot"
else
  echo "Dry-run only. Re-run with --apply to copy."
fi
echo "Ambiguous (manual):        $ask_count"
echo "Skipped:                   $skipped"
echo
echo "Next steps:"
echo "  1. Review:  cd \"$AGENT_ROOT\" && git status"
if [[ -d "$COPILOT_ROOT/.git" ]]; then
  echo "             cd \"$COPILOT_ROOT\" && git status"
fi
echo "  2. Commit & push each repo (no secrets / .env)."
echo "  3. User Rules (tone, language) → Cursor Settings → Rules (not git)."
echo "  4. Optional: keep local copies or remove after push to avoid drift."
echo
echo "Docs: $AGENT_ROOT/knowledge-base/assistants-placement.md"
