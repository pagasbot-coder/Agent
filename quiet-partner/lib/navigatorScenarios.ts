/** Static navigator regression scenarios (navigator-scenarios.md) for in-app reference. */
export type NavigatorScenario = {
  id: string;
  title: string;
  userInput: string;
  expectations: string[];
};

export const NAVIGATOR_SCENARIOS: NavigatorScenario[] = [
  {
    id: "S1",
    title: "Конфликт стейкхолдеров",
    userInput:
      "Два спонсора тянут архитектуру в разные стороны, сроки горят.",
    expectations: [
      "Уточнить цели каждого (отчёт vs пиар), не только «кнопки».",
      "Разрез по времени (v1/v2), не «выберите сторону».",
      "Без канцелярита «домен Stakeholders».",
    ],
  },
  {
    id: "S2",
    title: "Фича в середине спринта",
    userInput: "Заказчик хочет новую фичу в середине спринта.",
    expectations: [
      "Спросить: блокирует ли демо / gold plating?",
      "Обмен на задачу из бэклога vs бюджет/срок.",
      "Не только «change request на $10k».",
    ],
  },
  {
    id: "S3",
    title: "Команда «опаздывает»",
    userInput: "Команда опаздывает.",
    expectations: [
      "«Есть метрики cycle time или это ощущение?»",
      "Отделить производительность vs scope creep.",
    ],
  },
  {
    id: "S4",
    title: "Всё зелёное, но тревога",
    userInput: "Все домены выше 70, но я не спокоен.",
    expectations: [
      "Не обесценивать; спросить, какой домен «чувствуется» слабым.",
      "Один конкретный check-in на неделю.",
    ],
  },
];
