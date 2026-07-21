#!/usr/bin/env bash
# Import ProductMap skills + .productmap KB from didactic-doodle into Agent.
# Marries them with Muster agents (see knowledge-base/skills-muster-bridge.md).
#
# READ-ONLY source: never writes back to didactic-doodle / product-copilot.
# Teammates keep adding data in the original repo; re-run --apply to refresh Agent.
#
# Usage:
#   ./scripts/import-didactic-skills.sh
#   ./scripts/import-didactic-skills.sh --apply
#   SOURCE=/path/to/didactic-doodle ./scripts/import-didactic-skills.sh --apply

set -euo pipefail

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE="${SOURCE:-}"
if [[ -z "$SOURCE" ]]; then
  for cand in \
    "$HOME/Projects/didactic-doodle" \
    "$HOME/Projects/product-copilot" \
    "$HOME/product-copilot" \
    "$(dirname "$AGENT_ROOT")/didactic-doodle" \
    "$(dirname "$AGENT_ROOT")/product-copilot"
  do
    if [[ -d "$cand/.agents/skills" ]] || [[ -d "$cand/.productmap" ]]; then
      SOURCE="$cand"
      break
    fi
  done
fi

echo "=== Import didactic-doodle → Agent (Muster bridge) ==="
echo "Agent:  $AGENT_ROOT"
echo "Source: ${SOURCE:-"(not found)"}"
echo "Mode:   $([[ $APPLY -eq 1 ]] && echo APPLY || echo DRY-RUN)"
echo

if [[ -z "$SOURCE" ]] || [[ ! -d "$SOURCE" ]]; then
  echo "Source project not found."
  echo "Set SOURCE to didactic-doodle (or product-copilot) root, e.g.:"
  echo "  SOURCE=/Users/marina/Projects/didactic-doodle $0 --apply"
  exit 1
fi

copy_tree() {
  local from="$1" to="$2" label="$3"
  if [[ ! -e "$from" ]]; then
    echo "  [skip] $label — missing: $from"
    return
  fi
  echo "  [→] $label"
  echo "      $from"
  echo "      → $to"
  if [[ $APPLY -eq 1 ]]; then
    mkdir -p "$(dirname "$to")"
    rm -rf "$to"
    cp -R "$from" "$to"
  fi
}

echo "--- Skills ---"
if [[ -d "$SOURCE/.agents/skills" ]]; then
  mkdir -p "$AGENT_ROOT/.agents/skills"
  shopt -s nullglob
  for skill_dir in "$SOURCE/.agents/skills"/*/; do
    name="$(basename "$skill_dir")"
    copy_tree "$skill_dir" "$AGENT_ROOT/.agents/skills/$name" "skill:$name"
  done
  shopt -u nullglob
else
  echo "  [skip] no .agents/skills in source"
fi

echo "--- ProductMap KB ---"
copy_tree "$SOURCE/.productmap" "$AGENT_ROOT/.productmap" ".productmap"

# Optional: productmap-specific Cursor rule (do not overwrite Muster vibecoder)
if [[ -f "$SOURCE/.cursor/rules/gemini-agent.mdc" ]]; then
  echo "--- Rules ---"
  copy_tree \
    "$SOURCE/.cursor/rules/gemini-agent.mdc" \
    "$AGENT_ROOT/.cursor/rules/productmap-gemini-agent.mdc" \
    "rule:productmap-gemini-agent (renamed, Muster untouched)"
fi

echo
if [[ $APPLY -eq 1 ]]; then
  echo "Done. Review:"
  echo "  ls .agents/skills"
  echo "  ls .productmap | head"
  echo "  git add .agents/skills .productmap .cursor/rules/productmap-gemini-agent.mdc"
  echo "  git status   # commit ONLY these paths — not unrelated quiet-partner edits"
else
  echo "Dry-run only. Re-run with --apply to copy."
fi
echo
echo "Bridge doc: knowledge-base/skills-muster-bridge.md"
