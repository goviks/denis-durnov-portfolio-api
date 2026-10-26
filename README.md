# Digital business card — Denis Durnov

Backend-приложение цифровой визитки на NestJS, TypeScript, GraphQL, Prisma и PostgreSQL. GraphQL API предоставляет профиль, ссылки, навыки, опыт работы и проекты. Графовая схема создается автоматически из типизированных моделей, а данные хранятся в PostgreSQL.

## Запуск с Docker

Требуется Docker с поддержкой Compose:

```bash
docker compose up --build
```

При запуске API ожидает готовности PostgreSQL, применяет схему Prisma и запускает идемпотентный seed. GraphQL endpoint: <http://localhost:3000/graphql>. Для Apollo Sandbox откройте endpoint в браузере; GraphQL Sandbox будет доступен как landing page Apollo Server.

Убедиться, что оба сервиса запущены:

```bash
docker compose ps
```

API должен перейти в состояние `healthy`. При каждом push в `main` GitHub Actions также собирает контейнеры, запускает PostgreSQL и API и выполняет проверочный GraphQL-запрос.

Остановить контейнеры:

```bash
docker compose down
```

Данные базы сохраняются в Docker volume `postgres_data`. Для полной очистки локальной базы вместе с данными используйте `docker compose down -v`.

## Запуск локально

Требуются Node.js 22+, npm и доступная PostgreSQL. Создайте `.env` на основе `.env.example`, затем:

```bash
npm ci
npm run start:dev
```

Команда запуска сначала выполняет `prisma db push` и `prisma db seed`, поэтому отдельная ручная подготовка базы не требуется. Для production-сборки:

```bash
npm run build
npm run start:prod
```

`DATABASE_URL` задает строку подключения; `PORT` задает порт приложения (по умолчанию `3000`).

В VS Code API можно запустить задачей **Run Portfolio API (production)**. После старта откройте <http://localhost:3000/graphql> для Apollo Sandbox.

## GraphQL

```graphql
query {
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
```

## Архитектурные решения

- **GraphQL code-first**: GraphQL-типы описаны декораторами NestJS и генерируют схему при запуске. Apollo Sandbox доступен на `/graphql`; локально GraphQL IDE не включается в production-режиме отдельным устаревшим GraphQL Playground.
- **Разделение ответственности**: resolver связывает GraphQL-запрос с сервисом, сервис содержит логику доступа к профилю, Prisma service отвечает за подключение к базе. Типизированные GraphQL-модели не раскрывают Prisma-модели напрямую как контракт API.
- **Вложенные данные без N+1**: сервис получает профиль со всеми связанными коллекциями одним Prisma-запросом. Поля `links`, `skills`, `experience` и `projects` не запускают отдельный запрос на каждую запись.
- **Данные и связи**: профиль имеет отдельные связанные таблицы для ссылок, навыков, опыта и проектов. Это позволяет расширять элементы независимо и задавать явные отношения и индексы. Период работы хранится как исходная строка для сохранения пользовательского формата.
- **Инициализация**: `db:prepare` сначала синхронизирует Prisma-схему с PostgreSQL, затем запускает seed с фиксированными идентификаторами и upsert. Повторный запуск не дублирует записи. Данные профиля, ссылок, навыков и опыта основаны на предоставленной информации; в seed добавлены основные публичные проекты для демонстрации GraphQL-результата.
- **Контейнеризация**: Compose запускает PostgreSQL и API, ожидая healthcheck базы перед стартом API. Dockerfile собирает TypeScript в отдельном build-этапе.

## Структура

```text
prisma/
  schema.prisma
  seed.ts
src/
  prisma/       Prisma client lifecycle
  profile/      GraphQL models, resolver, service
  app.module.ts GraphQL and feature modules
  main.ts       Application bootstrap
```

## Публикация

Исходный код: <https://github.com/goviks/denis-durnov-portfolio-api>.

Для production-развертывания используйте платформу с поддержкой Docker и PostgreSQL. Задайте `DATABASE_URL` как секрет платформы; не используйте учетные данные из Compose вне локальной разработки. Публичный адрес работающего API пока не настроен.
