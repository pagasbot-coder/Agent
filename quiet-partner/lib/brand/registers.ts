/** Brand pulpit — register schemas and stage rail (wave B MVP). */

export type ColumnDef = {
  key: string;
  label: string;
  type?: "select";
  options?: string[];
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
  /** Stages 3–6 are scenario until Go — show badge in UI. */
  scenario?: boolean;
  editors: string[];
  docLinks: { slug: string; title: string }[];
};

export const REGISTERS: Record<string, RegisterDef> = {
  auditoriya: {
    id: "auditoriya",
    path: "reestry/R-01-auditoriya.md",
    title: "Аудитория",
    columns: [
      { key: "who", label: "Кто", multiline: true },
      { key: "role", label: "Роль" },
      { key: "deal", label: "Тип сделки" },
      { key: "hire", label: "Зачем нанимают продукт", multiline: true },
      { key: "pain", label: "Боль", multiline: true },
      { key: "insight", label: "Вывод", multiline: true },
      { key: "source", label: "Откуда" },
    ],
    header: `# Р-01. Аудитория

**Линейка:** {{project}}  

`,
  },
  konkurenty: {
    id: "konkurenty",
    path: "reestry/R-02-konkurenty.md",
    title: "Конкуренты",
    columns: [
      { key: "player", label: "Игрок / линейка", multiline: true },
      { key: "promise", label: "Обещание", multiline: true },
      { key: "price", label: "Ценовой уровень" },
      { key: "strength", label: "Сильная сторона", multiline: true },
      { key: "gap", label: "Дыра для нас", multiline: true },
      { key: "source", label: "Источник" },
    ],
    header: `# Р-02. Конкуренты

**Линейка:** {{project}}  

`,
  },
  platforma: {
    id: "platforma",
    path: "reestry/R-03-platforma.md",
    title: "Платформа",
    columns: [
      { key: "element", label: "Элемент" },
      { key: "text", label: "Формулировка", multiline: true },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["черновик", "ок", "частично", "открыто", "рамка"],
      },
      { key: "date", label: "Дата" },
    ],
    header: `# Р-03. Платформа бренда

**Линейка:** {{project}}  

`,
  },
  assortiment: {
    id: "assortiment",
    path: "reestry/R-04-assortiment.md",
    title: "Ассортимент",
    columns: [
      { key: "sku", label: "Товар" },
      { key: "role", label: "Роль" },
      { key: "format", label: "Объём / формат" },
      { key: "pack", label: "Упаковка", multiline: true },
      { key: "status", label: "Статус", multiline: true },
      { key: "note", label: "Заметка", multiline: true },
    ],
    header: `# Р-04. Ассортимент

**Линейка:** {{project}}  

`,
  },
  resheniya: {
    id: "resheniya",
    path: "reestry/R-08-resheniya.md",
    title: "Решения",
    columns: [
      { key: "date", label: "Дата" },
      { key: "decision", label: "Решение", multiline: true },
      { key: "who", label: "Кто" },
      { key: "why", label: "Почему", multiline: true },
      { key: "artifact", label: "Артефакт", multiline: true },
    ],
    header: `# Р-08. Решения

**Линейка:** {{project}}  

`,
  },
  neznaem: {
    id: "neznaem",
    path: "reestry/R-09-ne-znaem.md",
    title: "Не знаем",
    columns: [
      { key: "q", label: "Вопрос", multiline: true },
      { key: "why", label: "Почему важно", multiline: true },
      { key: "how", label: "Как закрыть", multiline: true },
      { key: "due", label: "Срок" },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["открыто", "закрыто", "устарел"],
      },
    ],
    header: `# Р-09. Не знаем

**Линейка:** {{project}}  
**Лимит:** ≤10 открытых  

`,
  },
  riski: {
    id: "riski",
    path: "reestry/R-11-riski.md",
    title: "Риски",
    columns: [
      { key: "risk", label: "Риск", multiline: true },
      { key: "type", label: "Тип" },
      { key: "impact", label: "Влияние на обещание", multiline: true },
      { key: "action", label: "Что делаем", multiline: true },
      { key: "owner", label: "Владелец" },
      {
        key: "status",
        label: "Статус",
        type: "select",
        options: ["открыто", "снижен", "принят", "закрыт"],
      },
    ],
    header: `# Р-11. Риски бренда

**Линейка:** {{project}}  

`,
  },
};

export const STAGES: StageDef[] = [
  {
    id: 0,
    name: "Разведка",
    short: "Разведка",
    gate: "Аудитория и конкуренты названы; открытые вопросы в Р-09.",
    editors: ["auditoriya", "konkurenty", "neznaem"],
    docLinks: [
      { slug: "sh-00", title: "Ш-00 Разведка" },
      { slug: "etapy", title: "Этапы 0–6" },
    ],
  },
  {
    id: 1,
    name: "Платформа",
    short: "Платформа",
    gate: "One-pager платформы черновик; ключевые решения записаны.",
    editors: ["platforma", "resheniya"],
    docLinks: [
      { slug: "sh-01", title: "Ш-01 One-pager" },
      { slug: "etapy", title: "Этапы 0–6" },
    ],
  },
  {
    id: 2,
    name: "Оффер",
    short: "Оффер",
    gate: "Ассортимент + риски; %/origin/COGS = «открыто», пока нет цифр завода.",
    editors: ["assortiment", "neznaem", "riski", "resheniya"],
    docLinks: [
      { slug: "china", title: "Китай → РФ" },
      { slug: "etapy", title: "Этапы 0–6" },
    ],
  },
  {
    id: 3,
    name: "Выход на рынок",
    short: "Рынок",
    gate: "План запуска и аргументы закупщику — сценарий до Go.",
    scenario: true,
    editors: ["resheniya"],
    docLinks: [
      { slug: "sh-05", title: "Ш-05 План запуска" },
      { slug: "sh-03", title: "Ш-03 Закупщику" },
    ],
  },
  {
    id: 4,
    name: "Исполнение",
    short: "Исполнение",
    gate: "Риски и «не знаем» в цикле; чеклист Китая на поставке.",
    scenario: true,
    editors: ["riski", "resheniya", "neznaem"],
    docLinks: [
      { slug: "china", title: "Китай → РФ" },
      { slug: "etapy", title: "Этапы 0–6" },
    ],
  },
  {
    id: 5,
    name: "Закрепление",
    short: "Закрепление",
    gate: "Решения по пилоту зафиксированы.",
    scenario: true,
    editors: ["resheniya"],
    docLinks: [{ slug: "etapy", title: "Этапы 0–6" }],
  },
  {
    id: 6,
    name: "Разбор",
    short: "Разбор",
    gate: "Уроки — в полном пульте / KB.",
    scenario: true,
    editors: [],
    docLinks: [{ slug: "etapy", title: "Этапы 0–6" }],
  },
];

/** Cheat sheets under content/brand/ (pointers to KB / wave A). */
export const CHEATSHEETS = [
  {
    slug: "etapy",
    title: "Этапы 0–6",
    file: "etapy-0-6.md",
  },
  {
    slug: "sh-00",
    title: "Ш-00 Разведка",
    file: "sh-00-razvedka.md",
  },
  {
    slug: "sh-01",
    title: "Ш-01 One-pager",
    file: "sh-01-one-pager.md",
  },
  {
    slug: "sh-03",
    title: "Ш-03 Закупщику",
    file: "sh-03-zakupshchiku.md",
  },
  {
    slug: "sh-05",
    title: "Ш-05 План запуска",
    file: "sh-05-plan-zapuska.md",
  },
  {
    slug: "china",
    title: "Китай → РФ",
    file: "china-checklist.md",
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
