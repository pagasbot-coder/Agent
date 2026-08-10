/** Stage control (ProjectM) — register schemas and stage rail. */

export type RegisterRow = Record<string, string>;

/** Уровни вероятности / влияния — полные русские слова (не В/С/Н и не латиница). */
export const LEVEL_OPTIONS = ["Высокая", "Средняя", "Низкая"] as const;

const LEVEL_KEYS = new Set(["influence", "prob", "impact"]);

/** Приводит старые коды В/С/Н и латиницу B/C/N к полным словам. */
export function normalizeLevel(raw: string | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  if (/^(в|b)$/i.test(s) || /^высок/i.test(s)) return "Высокая";
  if (/^(с|c)$/i.test(s) || /^средн/i.test(s)) return "Средняя";
  if (/^(н|n)$/i.test(s) || /^низк/i.test(s)) return "Низкая";
  return s;
}

/** Нормализация уровней во всех реестрах (localStorage / старые сиды). */
export function normalizeRegisterCache(
  cache: Record<string, RegisterRow[]>,
): Record<string, RegisterRow[]> {
  const out: Record<string, RegisterRow[]> = {};
  for (const [id, rows] of Object.entries(cache)) {
    out[id] = (rows ?? []).map((row) => {
      const next: RegisterRow = { ...row };
      for (const key of LEVEL_KEYS) {
        if (key in next) next[key] = normalizeLevel(next[key]);
      }
      return next;
    });
  }
  return out;
}

export type ColumnDef = {
  key: string;
  label: string;
  type?: "select";
  options?: string[];
  /** Long text — textarea + wrap (readable in pulpit). */
  multiline?: boolean;
};

export type RegisterDef = {
  id: string;
  path: string;
  title: string;
  columns: ColumnDef[];
  header: string;
};

/** Ссылка на шаблон (shablon) или реестр — показывается в карточке этапа. */
export type StageDocLink = {
  href: string;
  title: string;
};

export type StageDef = {
  id: number;
  name: string;
  short: string;
  gate: string;
  editors: string[];
  /** Разовые шаблоны (устав, статус…) — не дублировать реестры из editors. */
  docLinks: StageDocLink[];
};

export const REGISTERS: Record<string, RegisterDef> = {
  storony: {
    id: "storony",
    path: "reestry/01-storony.md",
    title: "Стороны",
    columns: [
      { key: "name", label: "Имя", multiline: true },
      { key: "role", label: "Роль на проекте", multiline: true },
      { key: "fn", label: "Чем занимается", multiline: true },
      {
        key: "influence",
        label: "Влияние",
        type: "select",
        options: [...LEVEL_OPTIONS],
      },
      { key: "interest", label: "Интерес", multiline: true },
      { key: "channel", label: "Канал связи", multiline: true },
      { key: "need", label: "Что нужно от него", multiline: true },
      { key: "silence", label: "Риск молчания", multiline: true },
      { key: "note", label: "Примечание", multiline: true },
    ],
    header: `# Реестр: заинтересованные стороны

**Проект:** {{project}}  
**Лимит:** 8–12 ключевых  

### Влияние

| Уровень | Значение |
|---------|----------|
| **Высокая** | Может остановить или перекроить проект |
| **Средняя** | Влияет, но один не блокирует всё |
| **Низкая** | Информирование или точечная помощь |

`,
  },
  riski: {
    id: "riski",
    path: "reestry/02-riski.md",
    title: "Риски",
    columns: [
      { key: "event", label: "Событие", multiline: true },
      {
        key: "prob",
        label: "Вероятность",
        type: "select",
        options: [...LEVEL_OPTIONS],
      },
      {
        key: "impact",
        label: "Влияние",
        type: "select",
        options: [...LEVEL_OPTIONS],
      },
      { key: "owner", label: "Владелец", multiline: true },
      { key: "mitigation", label: "Мера до события", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["открыт", "снижен", "принят", "закрыт"],
      },
      { key: "date", label: "Дата" },
    ],
    header: `# Реестр: риски

**Проект:** {{project}}  
**Лимит:** 7–10 активных  

### Вероятность и влияние

Пишем словами: **Высокая** / **Средняя** / **Низкая** (не сокращения В/С/Н).

`,
  },
  byudzhet: {
    id: "byudzhet",
    path: "reestry/03-byudzhet.md",
    title: "Бюджет",
    columns: [
      { key: "item", label: "Статья", multiline: true },
      { key: "plan", label: "План" },
      { key: "fact", label: "Факт" },
      { key: "forecast", label: "Прогноз" },
      { key: "delta", label: "Отклонение" },
      { key: "note", label: "Комментарий", multiline: true },
    ],
    header: `# Реестр: бюджет (план — факт — прогноз)

**Проект:** {{project}}  
**Резерв:** 10–20 %  

`,
  },
  resheniya: {
    id: "resheniya",
    path: "reestry/04-resheniya.md",
    title: "Решения",
    columns: [
      { key: "date", label: "Дата" },
      { key: "decision", label: "Решение", multiline: true },
      { key: "why", label: "Почему", multiline: true },
      { key: "whoA", label: "Кто утвердил", multiline: true },
      { key: "whoR", label: "Кто делает", multiline: true },
      { key: "rejected", label: "Что отвергли", multiline: true },
      { key: "link", label: "Связь", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["принято", "отменено"],
      },
    ],
    header: `# Реестр: журнал решений

**Проект:** {{project}}  

`,
  },
  neznaem: {
    id: "neznaem",
    path: "reestry/05-ne-znaem.md",
    title: "Не знаем",
    columns: [
      { key: "q", label: "Вопрос", multiline: true },
      { key: "why", label: "Зачем", multiline: true },
      { key: "owner", label: "Кто ответит", multiline: true },
      { key: "due", label: "Срок" },
      { key: "ifNot", label: "Если не ответим", multiline: true },
      { key: "hyp", label: "Гипотеза", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["открыт", "закрыт", "устарел"],
      },
      { key: "closed", label: "Закрыто чем", multiline: true },
    ],
    header: `# Реестр: открытые вопросы («не знаем»)

**Проект:** {{project}}  
**Лимит:** ≤10 открытых  

`,
  },
  vekhi: {
    id: "vekhi",
    path: "reestry/06-vekhi.md",
    title: "Вехи",
    columns: [
      { key: "name", label: "Веха", multiline: true },
      { key: "date", label: "Дата цели" },
      { key: "dod", label: "Критерий готовности", multiline: true },
      { key: "owner", label: "Владелец", multiline: true },
      { key: "dep", label: "Зависимость", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["не начато", "в работе", "на приёмке", "принято", "сдвиг"],
      },
      { key: "shift", label: "Сдвиг / причина", multiline: true },
      {
        key: "money",
        label: "Влияет на бюджет",
        type: "select",
        options: ["нет", "да"],
      },
    ],
    header: `# Реестр: вехи + критерий готовности

**Проект:** {{project}}  
**Лимит:** 5–8 вех  

`,
  },
  artefakty: {
    id: "artefakty",
    path: "reestry/07-artefakty.md",
    title: "Артефакты",
    columns: [
      { key: "name", label: "Артефакт", multiline: true },
      { key: "why", label: "Зачем", multiline: true },
      { key: "owner", label: "Владелец", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["не начато", "в работе", "черновик", "готово", "устарел"],
      },
      { key: "link", label: "Где лежит", multiline: true },
      { key: "note", label: "Примечание", multiline: true },
    ],
    header: `# Реестр: артефакты проекта

**Проект:** {{project}}  
**Лимит:** 8–12 ключевых  

`,
  },
};

export const STAGES: StageDef[] = [
  {
    id: 0,
    name: "Разведка",
    short: "Разведка",
    gate: "Проблема, гипотеза решения, критерии успеха.",
    editors: ["storony", "neznaem", "artefakty"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/00-zametki-razvedki",
        title: "Заметки разведки",
      },
    ],
  },
  {
    id: 1,
    name: "Запуск",
    short: "Запуск",
    gate: "Устав согласован, цели измеримы.",
    editors: ["storony", "resheniya", "vekhi", "artefakty", "riski"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/01-ustav-proekta",
        title: "Устав",
      },
    ],
  },
  {
    id: 2,
    name: "Подготовка",
    short: "Подготовка",
    gate: "Критичные «не знаем» закрыты, один план.",
    editors: ["neznaem", "riski", "artefakty", "byudzhet", "vekhi"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/02-matricza-otvetstvennosti",
        title: "Матрица ответственности",
      },
      {
        href: "/stages/docs/file/shablony/02-plan-svyazi",
        title: "План связи",
      },
    ],
  },
  {
    id: 3,
    name: "Планирование",
    short: "План",
    gate: "Ближайшие 2–3 недели детальны, у вех есть критерии.",
    editors: ["vekhi", "artefakty", "byudzhet", "riski"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/02-matricza-otvetstvennosti",
        title: "Матрица ответственности",
      },
    ],
  },
  {
    id: 4,
    name: "Исполнение",
    short: "Исполнение",
    gate: "Заказчик в цикле, красное названо.",
    editors: ["resheniya", "vekhi", "artefakty", "byudzhet", "riski", "neznaem"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/04-ezhenedelnyy-status",
        title: "Еженедельный статус",
      },
    ],
  },
  {
    id: 5,
    name: "Сдача",
    short: "Сдача",
    gate: "Принято по требованиям, пакет передачи готов.",
    editors: ["vekhi", "artefakty", "resheniya", "byudzhet"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/05-priemka-i-peredacha",
        title: "Приёмка и передача",
      },
    ],
  },
  {
    id: 6,
    name: "Разбор",
    short: "Разбор",
    gate: "Уроки записаны.",
    editors: ["artefakty", "resheniya"],
    docLinks: [
      {
        href: "/stages/docs/file/shablony/06-uroki-razbora",
        title: "Уроки разбора",
      },
    ],
  },
];

/** Cheat sheets available under content/projectm/ */
export const CHEATSHEETS = [
  {
    slug: "01-etapy-proekta",
    title: "Шпаргалка этапов",
    file: "01-etapy-proekta.md",
  },
  {
    slug: "02-marketing-proekty",
    title: "Маркетинг",
    file: "02-marketing-proekty.md",
  },
  {
    slug: "03-sobes-i-pervaya-nedelya",
    title: "Собес",
    file: "03-sobes-i-pervaya-nedelya.md",
  },
] as const;

export function emptyRow(reg: RegisterDef): RegisterRow {
  const obj: RegisterRow = {};
  for (const c of reg.columns) obj[c.key] = "";
  return obj;
}

function escapeCell(s: string) {
  return String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/** Build MD file body for a register. */
export function objectsToMarkdown(
  reg: RegisterDef,
  rows: RegisterRow[],
  projectName: string,
): string {
  const proj = projectName || "_________________";
  const head = reg.header.replaceAll("{{project}}", proj);
  const labels = reg.columns.map((c) => c.label);
  const sep = reg.columns.map(() => "-----");
  const lines = [
    head.trimEnd(),
    "",
    `| ${labels.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
  ];
  const data = rows.length ? rows : [emptyRow(reg)];
  for (const row of data) {
    lines.push(
      `| ${reg.columns.map((c) => escapeCell(row[c.key] ?? "")).join(" | ")} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
