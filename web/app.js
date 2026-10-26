const profileQuery = `
  query ProfilePage {
    profile {
      name
      description
      links {
        label
        url
      }
      skills {
        name
      }
      experience {
        company
        position
        period
        achievements
      }
      projects {
        name
        url
      }
    }
  }
`;

const errorPanel = document.querySelector("#load-error");
const retryButton = document.querySelector("#retry-button");
document.querySelector("#current-year").textContent = new Date().getFullYear();

function makeExternalLink(url, label, className) {
  const parsedUrl = new URL(url, window.location.origin);
  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error("В данных профиля обнаружена некорректная ссылка");
  }

  const link = document.createElement("a");
  link.className = className;
  link.href = parsedUrl.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function renderExperience(items) {
  const list = document.querySelector("#experience-list");
  list.replaceChildren();

  for (const item of items) {
    const article = document.createElement("article");
    article.className = "experience-item";

    const period = document.createElement("div");
    period.className = "experience-period";
    period.textContent = item.period;

    const content = document.createElement("div");
    content.className = "experience-content";

    const company = document.createElement("h3");
    company.textContent = item.company;

    const position = document.createElement("p");
    position.className = "experience-position";
    position.textContent = item.position;

    const achievements = document.createElement("ul");
    achievements.className = "achievement-list";
    for (const achievement of item.achievements) {
      const point = document.createElement("li");
      point.textContent = achievement;
      achievements.append(point);
    }

    content.append(company, position, achievements);
    article.append(period, content);
    list.append(article);
  }

  if (items.length === 0) {
    list.textContent = "Информация об опыте пока не добавлена.";
  }
}

function renderSkills(items) {
  const list = document.querySelector("#skill-list");
  list.replaceChildren();
  for (const item of items) {
    const skill = document.createElement("span");
    skill.className = "skill-chip";
    skill.textContent = item.name;
    list.append(skill);
  }
  if (items.length === 0) {
    list.textContent = "Навыки пока не добавлены.";
  }
}

function renderProjects(items) {
  const list = document.querySelector("#project-list");
  list.replaceChildren();

  for (const [index, item] of items.entries()) {
    const article = document.createElement("article");
    article.className = "project-card";

    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = `0${index + 1} / PROJECT`;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const link = makeExternalLink(item.url, item.url, "project-url");
    const arrow = document.createElement("span");
    arrow.className = "project-arrow";
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);

    article.append(number, title, link);
    list.append(article);
  }

  if (items.length === 0) {
    list.textContent = "Проекты пока не добавлены.";
  }
}

function renderContacts(items) {
  const list = document.querySelector("#contact-list");
  list.replaceChildren();

  for (const item of items) {
    const link = makeExternalLink(item.url, item.label, "contact-item");
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    list.append(link);
  }

  if (items.length === 0) {
    list.textContent = "Контактные ссылки пока не добавлены.";
  }
}

async function loadProfile() {
  errorPanel.hidden = true;
  retryButton.disabled = true;

  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: profileQuery }),
    });
    if (!response.ok) {
      throw new Error(`Сервер ответил с ошибкой (${response.status})`);
    }

    const result = await response.json();
    if (result.errors?.length) {
      throw new Error(result.errors.map((error) => error.message).join("; "));
    }
    if (!result.data?.profile) {
      throw new Error("Профиль не найден");
    }

    const profile = result.data.profile;
    document.querySelector("#profile-name").textContent = profile.name;
    document.querySelector("#profile-description").textContent =
      profile.description;
    renderExperience(profile.experience);
    renderSkills(profile.skills);
    renderProjects(profile.projects);
    renderContacts(profile.links);
  } catch (error) {
    console.error("Не удалось загрузить профиль:", error);
    errorPanel.hidden = false;
  } finally {
    retryButton.disabled = false;
  }
}

retryButton.addEventListener("click", loadProfile);
void loadProfile();
