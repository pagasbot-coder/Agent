/** Demo seed: Travel+ Natural from wave A registries. %/origin/COGS stay «открыто». */

import type { RegisterRow } from "./registers";

export const DEMO_LINE_NAME = "Travel+ Natural";
export const DEMO_STAGE_ID = 2;

export const DEMO_NATURAL: Record<string, RegisterRow[]> = {
  auditoriya: [
    {
      who: "Eco / wellness, 3–4★",
      role: "закупщик",
      deal: "каталог / тендер",
      hire: "Выглядеть «зеленее» без дыры в бюджете",
      pain: "NS дорого или нет в наличии",
      insight: "Своя полка + бумаги",
      source: "разведка 23.07",
    },
    {
      who: "Гость после дороги",
      role: "гость",
      deal: "-",
      hire: "Мягкий натуральный уход",
      pain: "Судит кожей и носом",
      insight: "Ощущение + честный текст на этикетке",
      source: "разведка 23.07",
    },
    {
      who: "Сеть со своим лого",
      role: "закупщик",
      deal: "СТМ",
      hire: "Логотип отеля на флаконе",
      pain: "Путают со своей Natural",
      insight: "СТМ — отдельный проект",
      source: "разведка 23.07",
    },
  ],
  konkurenty: [
    {
      player: "Hotel Line (свой)",
      promise: "Цена и база",
      price: "~12–15 ₽ / 30 мл",
      strength: "Стабильный эконом",
      gap: "Мягче и натуральнее ощущение",
      source: "витрина",
    },
    {
      player: "Natura Siberica",
      promise: "Premium eco-имя",
      price: "~30–40 ₽ и выше",
      strength: "Узнаваемость",
      gap: "Своё имя Travel+ + стабильный склад",
      source: "каталог",
    },
    {
      player: "ЕТС Natural",
      promise: "Eco-витрина",
      price: "~18 ₽ / 25 мл",
      strength: "Уже в eco-слоте",
      gap: "Другой запах/ощущение + пакет Travel+",
      source: "витрина",
    },
  ],
  platforma: [
    {
      element: "Сущность",
      text: "Travel+ Natural — своя натуральная линейка amenities",
      status: "черновик",
      date: "26.07",
    },
    {
      element: "Обещание (1 фраза)",
      text: "Мягкий уход. Понятная натуральность. Важны и гость, и документы",
      status: "черновик",
      date: "26.07",
    },
    {
      element: "Origin",
      text: "Пока не зафиксирован — не говорим «российское»",
      status: "открыто",
      date: "27.07",
    },
    {
      element: "% натуральности / COGS",
      text: "открыто — ждём технолога (T-041)",
      status: "открыто",
      date: "27.07",
    },
    {
      element: "Аудитория",
      text: "Eco / wellness и сети 3–4★; гость после дороги",
      status: "ок",
      date: "23.07",
    },
    {
      element: "Доказательства (до 3)",
      text: "Состав в границах · бумаги Travel+ · ощущение в номере",
      status: "частично",
      date: "27.07",
    },
    {
      element: "Антипозиция",
      text: "Не самые дешёвые · не «органик» без бумаг · не копия NS",
      status: "ок",
      date: "27.07",
    },
    {
      element: "Характер",
      text: "Спокойный, честный, заботливый",
      status: "ок",
      date: "26.07",
    },
  ],
  assortiment: [
    {
      sku: "Шампунь",
      role: "якорь",
      format: "30 мл",
      pack: "матовая, спокойные тона",
      status: "идея / ждём образец",
      note: "пилот",
    },
    {
      sku: "Гель",
      role: "якорь",
      format: "30 мл",
      pack: "то же",
      status: "идея / ждём образец",
      note: "пилот",
    },
    {
      sku: "Мыло",
      role: "якорь",
      format: "-",
      pack: "то же",
      status: "идея",
      note: "пилот",
    },
  ],
  resheniya: [
    {
      date: "23.07",
      decision: "Берём Natural",
      who: "Human",
      why: "Дыра на витрине между HL и NS",
      artifact: "пульт этап 0",
    },
    {
      date: "27.07",
      decision: "Без границ состава и сенсорики в рынок не идём",
      who: "бренд + Human",
      why: "Риск greenwashing",
      artifact: "DoD этапа 2",
    },
  ],
  neznaem: [
    {
      q: "Какой запах и тактильность победят у гостей",
      why: "Сердце бренда",
      how: "Слепой тест 15–20 чел. после образца",
      due: "после образца",
      status: "открыто",
    },
    {
      q: "Метод и минимум % натуральности",
      why: "Тело обещания",
      how: "Технолог + бренд",
      due: "T-041",
      status: "открыто",
    },
    {
      q: "Origin: свой завод / Китай / вместе",
      why: "Честность перед eco-закупщиком",
      how: "Технолог + ops",
      due: "T-041",
      status: "открыто",
    },
  ],
  riski: [
    {
      risk: "Natural без бумаг",
      type: "legal",
      impact: "Ломает доверие",
      action: "Сначала пакет завода; в КП только из папки",
      owner: "юрист / технолог",
      status: "открыто",
    },
    {
      risk: "Состав не тянет обещание",
      type: "качество",
      impact: "Слово Natural врёт",
      action: "Метод и минимум % до этикетки",
      owner: "технолог + бренд",
      status: "открыто",
    },
  ],
};
