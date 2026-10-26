# Digital business card — Denis Durnov

Backend-приложение цифровой визитки на NestJS, TypeScript, GraphQL, Prisma и PostgreSQL. GraphQL API предоставляет профиль, ссылки, навыки, опыт работы и проекты. Схема GraphQL создается автоматически из типизированных моделей, данные хранятся в PostgreSQL.

## Запуск без контейнеров (Windows)

Docker и Docker Compose не требуются. Нужны Node.js 22.12 или новее (до 27), npm 10 или новее и установленный PostgreSQL 17 или новее.

### 1. Установите Node.js и PostgreSQL

Для Node.js можно использовать менеджер версий, например [nvm-windows](https://github.com/coreybutler/nvm-windows):

```powershell
nvm install 22
nvm use 22
node --version
npm.cmd --version
```

Файл `.nvmrc` содержит требуемую основную версию Node.js. Если Node.js уже установлен, проверьте, что его версия соответствует диапазону в `package.json`.

Установите PostgreSQL для Windows обычным установщиком с [официальной страницы загрузки](https://www.postgresql.org/download/windows/). Во время установки запомните пароль пользователя `postgres`; оставьте PostgreSQL запущенным как службу Windows. Для настройки базы удобно использовать pgAdmin, который входит в установщик.

В pgAdmin откройте Query Tool для сервера PostgreSQL и выполните, задав собственный пароль вместо `change-this-password`:

```sql
CREATE ROLE portfolio WITH LOGIN PASSWORD 'change-this-password';
CREATE DATABASE portfolio OWNER portfolio;
```

### 2. Настройте приложение

В корне проекта создайте `.env` на основе шаблона:

```powershell
Copy-Item .env.example .env
```

В `.env` укажите пароль, заданный для роли `portfolio`. Строка подключения должна иметь вид:

```dotenv
DATABASE_URL="postgresql://portfolio:ВАШ_ПАРОЛЬ@localhost:5432/portfolio?schema=public"
PORT=3000
```

Если пароль содержит зарезервированные символы URL, закодируйте их в строке подключения.

### 3. Установите зависимости и запустите API

Из корня проекта выполните команды в PowerShell:

```powershell
npm.cmd ci
npm.cmd run start:dev
```

При запуске приложение применяет схему Prisma к локальной базе и идемпотентно загружает начальные данные. GraphQL endpoint: <http://localhost:3000/graphql>. Откройте его в браузере для Apollo Sandbox.

В VS Code API также можно запустить задачей **Run Portfolio API (development)**.

## Проверки и production-сборка

Unit-тесты и сборка запускаются без контейнеров. Для них подключение к PostgreSQL не требуется:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Для production после настройки `DATABASE_URL` и сборки запустите:

```powershell
npm.cmd run start:prod
```

`start:prod` также выполняет подготовку базы данных и seed при запуске. `DATABASE_URL` задает строку подключения, `PORT` — порт API (по умолчанию `3000`).

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
- **Инициализация**: `db:prepare` сначала синхронизирует Prisma-схему с PostgreSQL, затем запускает seed с фиксированными идентификаторами и upsert. Повторный запуск не дублирует записи. Данные профиля, ссылок, навыков и опыта основаны на предоставленной информации; в seed добавлены основные публичные проекты.
- **Локальный запуск**: API запускается непосредственно через Node.js и подключается к установленной PostgreSQL по `DATABASE_URL`. Для управления версиями Node.js в репозитории указан `.nvmrc`.

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

Для production-развертывания используйте платформу, поддерживающую Node.js и PostgreSQL. Укажите `DATABASE_URL` как секрет окружения платформы. Публичный адрес работающего API пока не настроен.
