# Денис Дурнов — full-stack портфолио

Полноценный сайт-портфолио: адаптивный фронтенд, GraphQL API на NestJS и SQLite через Prisma. Фронтенд и API запускаются одним Node.js сервером. Docker, Docker Compose, PostgreSQL, отдельный фронтенд-сервер и ручная настройка базы не нужны.

## Быстрый запуск в Windows

Нужны Node.js 22.12+ и npm 10+. Версия Node указана в `.nvmrc`.

Откройте PowerShell в папке проекта и выполните:

```powershell
npm.cmd ci
npm.cmd run start:dev
```

При первом запуске проект сам создаст `.env`, SQLite-базу `prisma/dev.db`, применит схему и заполнит её демонстрационными данными. Откройте:

- Сайт: <http://localhost:3000>
- GraphQL API и Apollo Sandbox: <http://localhost:3000/graphql>

Остановить локальный сервер: `Ctrl+C`.

Если `.env` уже существует, он сохраняется. Для сброса старых параметров к настройкам этого проекта удалите `.env` и запустите команду ещё раз — приложение создаст новый на основе `.env.example`.

### Запуск в VS Code

Выберите задачу **Run Portfolio website (development)**. Она запускает тот же full-stack проект и автоматически подготавливает базу.

## Production-сборка

Создать production-сборку фронтенда и API и запустить её:

```powershell
npm.cmd run build
npm.cmd run start:prod
```

Сборка NestJS копирует веб-файлы в `dist/web`; production-сервер отдаёт сайт и API с одного адреса. Локальные данные сохраняются в `prisma/dev.db` и не попадают в Git.

## Проверки

Тесты и production-сборка выполняются без контейнеров и без установленной базы данных:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Тесты покрывают загрузку профиля, обработку ошибок API и чтение достижений опыта.

## Стек и структура

- **Фронтенд:** адаптивный HTML/CSS/JavaScript без отдельного сборщика и дополнительного сервера; профиль загружается из GraphQL API.
- **Backend:** NestJS, GraphQL и Apollo Sandbox.
- **Локальная база:** SQLite — один обычный файл на диске, без серверной службы и контейнеров.
- **Доступ к данным:** Prisma; команда запуска применяет схему и повторно загружает seed без создания дубликатов.

```text
prisma/
  schema.prisma
  seed.ts
src/
  main.ts              NestJS API и раздача фронтенда
  profile/             GraphQL resolver, service и модели
web/
  index.html           страница портфолио
  styles.css           адаптивные стили
  app.js               загрузка данных через GraphQL
scripts/
  ensure-env.cjs       создание локального .env при первом запуске
  copy-web.cjs         копирование фронтенда в production-сборку
```

Исходный код: <https://github.com/goviks/denis-durnov-portfolio-api>.
