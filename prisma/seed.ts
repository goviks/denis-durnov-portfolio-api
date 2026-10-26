import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const profileId = "denis-durnov";

const profile = {
  id: profileId,
  name: "Denis Durnov",
  description: "Admin",
};

const links = [
  {
    id: "denis-github",
    label: "GitHub",
    url: "https://github.com/goviks/workspace-ultra",
    profileId,
  },
  {
    id: "denis-linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/denis-durnov-229b65444/",
    profileId,
  },
];

const skills = [
  "Английский язык",
  "Основы программирования",
  "Коммуникабельность",
  "Работа в команде",
  "Базовый уровень JavaScript",
  "Git",
  "Python",
  "Машинное обучение",
  "Алгоритмы и структуры данных",
  "ООП",
  "Математическая статистика",
  "Docker",
  "Linux",
  "API",
].map((name, index) => ({
  id: `denis-skill-${index + 1}`,
  name,
  profileId,
}));

const projects = [
  {
    id: "portfolio-api",
    name: "Portfolio API",
    url: "https://github.com/goviks/denis-durnov-portfolio-api",
    profileId,
  },
  {
    id: "workspace-ultra",
    name: "Workspace Ultra",
    url: "https://github.com/goviks/workspace-ultra",
    profileId,
  },
];

const experience = [
  {
    id: "ministry-of-defence-2025",
    company: "Министерство Обороны РФ",
    position: "Заведующий отделением делопроизводства",
    period: "Ноябрь 2025 — Октябрь 2026 (1 год)",
    achievements: [
      "Инициировал и внедрил полный переход с бумажного на электронный документооборот, организовав цифровую регистрацию, автоматизацию и хранение документов.",
      "Стандартизировал шаблоны и процессы обработки документации, сократив время подготовки типовых документов на 30%.",
    ],
    profileId,
  },
  {
    id: "t-bank-2024",
    company: "Т-Банк",
    position: "Специалист технической поддержки",
    period: "Декабрь 2024 — Сентябрь 2025 (10 месяцев)",
    achievements: [
      "Осуществлял техническое сопровождение клиентов. Диагностировал и оптимизировал модуль классификации инцидентов, обеспечивая своевременное решение обращений по тикетам.",
      "Повысил уровень удовлетворенности клиентов, сократив среднее время решения тикетов на 15% за счет повышения эффективности процессов диагностики и обработки запросов.",
    ],
    profileId,
  },
  {
    id: "yandex-2024",
    company: "Яндекс",
    position: "Специалист технической поддержки",
    period: "Июнь 2024 — Сентябрь 2024 (4 месяца)",
    achievements: [
      "Оперативно обрабатывал клиентские обращения, выявлял причины технических сбоев и контролировал устранение проблемных вопросов.",
      "Взаимодействовал со смежными подразделениями для повышения стабильности сервисов и качества клиентского опыта.",
    ],
    profileId,
  },
];

async function seed(): Promise<void> {
  await prisma.profile.upsert({
    where: { id: profile.id },
    create: profile,
    update: profile,
  });

  for (const link of links) {
    await prisma.profileLink.upsert({
      where: { id: link.id },
      create: link,
      update: link,
    });
  }

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      create: skill,
      update: skill,
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      create: project,
      update: project,
    });
  }

  for (const item of experience) {
    await prisma.experience.upsert({
      where: { id: item.id },
      create: item,
      update: item,
    });
  }
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed profile data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
