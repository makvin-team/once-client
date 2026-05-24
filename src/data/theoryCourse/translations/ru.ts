import type { TheoryDictionary } from "../../theoryCourse";
import { theoryCourseEn } from "./en";

// Russian translation — UI chrome is translated; module body content falls
// back to the English source for now. Replace `modules`/`pillars` keys with
// full Russian copy as it lands; the structure matches en.ts key-for-key.
export const theoryCourseRu: TheoryDictionary = {
  ...theoryCourseEn,
  ui: {
    eyebrow: "Теоретический режим",
    pageTitle: "Веб-курс",
    pageDescription:
      "Читаемая версия 3D-симулятора. К каждому сценарию в симуляторе здесь есть соответствующий теоретический урок — прочитайте перед практикой или используйте для повторения.",
    pillarLabel: "Направление",
    modulesCount: (n, minutes) => `${n} модулей · ${minutes} мин`,
    open: "Открыть",
    breadcrumbRoot: "Веб-курс",
    pillarSubtitleLine: (priority, subtitle) =>
      `Направление ${priority} · ${subtitle}`,
    read: "Читать",
    moduleMeta: (minutes, indicators) =>
      `${minutes} мин чтения · ${indicators} индикаторов · 1 решение`,
    aboutPillar: "Об этом направлении",
    pillarSummary: (title, count) => `${title} · ${count} модулей`,
    aboutPillarLessons: (n) => `${n} теоретических уроков`,
    aboutPillarMinutes: (m) => `~${m} минут всего`,
    aboutPillarMaps: "Каждый урок соответствует сценарию симулятора",
    aboutPillarFooter:
      "Прочитайте теорию, затем откройте тот же сценарий в 3D-симуляторе, чтобы отработать решение под давлением времени.",
    pillarNotFoundTitle: "Направление не найдено",
    pillarNotFoundDescription: "Запрошенное направление не существует.",
    backToPillars: "Назад ко всем направлениям",
    moduleEyebrow: (pillar, minutes) => `${pillar} · ${minutes} мин чтения`,
    learningObjective: "Цель обучения",
    sectionOverview: "Обзор",
    sectionIndicators: "Индикаторы для наблюдения",
    sectionDecision: "Решение",
    sectionTakeaways: "Ключевые выводы",
    sectionReferences: "Источники",
    severity: {
      critical: "КРИТИЧНО",
      high: "ВЫСОКО",
      medium: "СРЕДНЕ",
      low: "НИЗКО",
    },
    decisionCorrect: "Верно",
    decisionPartial: "Частично",
    decisionFail: "Ошибка",
    pointsLabel: (n) => `${n} баллов`,
    previousModule: "← Предыдущий модуль",
    nextModule: "Следующий модуль →",
    allPillarModules: (pillar) => `Все модули ${pillar}`,
    lessonNotFoundTitle: "Урок не найден",
    lessonNotFoundDescription: "Запрошенный теоретический урок не существует.",
  },
};
