# Skills in this monorepo (Agent)

**Канон:** все project skills живут в **`.agents/skills/<name>/SKILL.md`**.

Эта папка (`.cursor/skills/`) — только указатель. Не дублируй сюда копии skills.

| Тип | Куда |
|-----|------|
| ProductMap / Muster (prd, competitor, figjam…) | `.agents/skills/` ← `import-didactic-skills.sh` |
| Каталог [skills.sh](https://www.skills.sh/) | `.agents/skills/` ← `npx skills add … -a cursor -y --copy` |
| Личные (все проекты) | `~/.cursor/skills/` (`npx skills add -g`) |

PM-книги и product-copilot skills — **не** сюда (см. [`assistants-placement.md`](../../knowledge-base/assistants-placement.md)).

Runbook каталога: [`docs/runbook-skills-sh.md`](../../docs/runbook-skills-sh.md).
