/** Stage control (ProjectM) — register schemas and stage rail. */

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

export type StageDef = {
  id: number;
  name: string;
  short: string;
  gate: string;
  editors: string[];
  docLinks: { slug: string; title: string }[];
};

export const REGISTERS: Record<string, RegisterDef> = {
  storony: {
    id: "storony",
    path: "reestry/01-storony.md",
    title: "Стороны",
    columns: [
      { key: "name", label: "Имя" },
      { key: "role", label: "Роль на проекте", multiline: true },
      { key: "fn", label: "Функция / что делает", multiline: true },
      {
        key: "influence",
        label: "Влияние",
        type: "select",
        options: ["В", "С", "Н"],
      },
      { key: "interest", label: "Интерес", multiline: true },
      { key: "channel", label: "Канал" },
      { key: "need", label: "Что нужно от него", multiline: true },
      { key: "silence", label: "Риск молчания", multiline: true },
      { key: "note", label: "Примечание", multiline: true },
    ],
    header: `# Реестр: заинтересованные стороны

**Проект:** {{project}}  
**Лимит:** 8–12 ключевых  

### Влияние (В / С / Н)

| Код | Значение |
|-----|----------|
| **В** | Высокое — может остановить или перекроить проект |
| **С** | Среднее — влияет, но не блокирует всё один |
| **Н** | Низкое — информирование / точечная помощь |

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
        label: "Вер.",
        type: "select",
        options: ["В", "С", "Н"],
      },
      {
        key: "impact",
        label: "Влияние",
        type: "select",
        options: ["В", "С", "Н"],
      },
      { key: "owner", label: "Владелец" },
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
      { key: "delta", label: "Δ" },
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
      { key: "whoA", label: "Кто решил (A)" },
      { key: "whoR", label: "Кто исполняет" },
      { key: "rejected", label: "Что отвергли", multiline: true },
      { key: "link", label: "Связь" },
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
      { key: "owner", label: "Владелец ответа" },
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
      { key: "owner", label: "Владелец" },
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
        label: "Деньги?",
        type: "select",
        options: ["нет", "да"],
      },
    ],
    header: `# Реестр: вехи + критерий готовности

**Проект:** {{project}}  
**Лимит:** 5–8 вех  

`,
  },
};

export const STAGES: StageDef[] = [
  {
    id: 0,
    name: "Разведка",
    short: "Разведка",
    gate: "Проблема, гипотеза решения, критерии успеха.",
    editors: ["storony", "neznaem"],
    docLinks: [],
  },
  {
    id: 1,
    name: "Запуск",
    short: "Запуск",
    gate: "Устав согласован, цели измеримы.",
    editors: ["storony", "resheniya", "vekhi"],
    docLinks: [],
  },
  {
    id: 2,
    name: "Подготовка",
    short: "Подготовка",
    gate: "Критичные «не знаем» закрыты, один план.",
    editors: ["neznaem", "riski", "byudzhet", "vekhi"],
    docLinks: [],
  },
  {
    id: 3,
    name: "Планирование",
    short: "План",
    gate: "Ближайшие 2–3 недели детальны, у вех есть критерии.",
    editors: ["vekhi", "byudzhet", "riski"],
    docLinks: [],
  },
  {
    id: 4,
    name: "Исполнение",
    short: "Исполнение",
    gate: "Заказчик в цикле, красное названо.",
    editors: ["resheniya", "vekhi", "byudzhet", "riski", "neznaem"],
    docLinks: [],
  },
  {
    id: 5,
    name: "Сдача",
    short: "Сдача",
    gate: "Принято по требованиям, пакет передачи готов.",
    editors: ["vekhi", "resheniya", "byudzhet"],
    docLinks: [],
  },
  {
    id: 6,
    name: "Разбор",
    short: "Разбор",
    gate: "Уроки записаны.",
    editors: [],
    docLinks: [],
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

export type RegisterRow = Record<string, string>;

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
