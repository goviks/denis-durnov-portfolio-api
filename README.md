# Денис Дурнов — full-stack портфолио

Адаптивное портфолио в тёплой айвори-золотой палитре: подтверждённый опыт, навыки, проекты и ссылки. NestJS GraphQL API и фронтенд работают вместе на Node.js; локально используется SQLite. Контейнеры и Docker не нужны.

## Быстрый запуск в Windows

Нужны Node.js 22.12+ и npm 10+. Версия Node указана в `.nvmrc`. В Windows PowerShell используйте `npm.cmd`, чтобы не зависеть от системной политики запуска PowerShell-скриптов.

Откройте PowerShell в папке проекта и выполните:

```powershell
npm.cmd ci
npm.cmd run start:dev
```

При первом запуске проект сам создаст `.env`, SQLite-базу `prisma/dev.db`, применит схему и заполнит её профилем. Откройте:

- Сайт: <http://localhost:3000>
- GraphQL API и Apollo Sandbox: <http://localhost:3000/graphql>

Остановить локальный сервер: `Ctrl+C`.

Если `.env` уже существует, он сохраняется. Для сброса параметров удалите `.env` и повторите запуск — файл будет создан из `.env.example`.

### Запуск в VS Code

Выберите задачу **Run Portfolio website (development)**. Она запускает тот же full-stack проект и автоматически подготавливает базу.

## Production-сборка

Создать production-сборку фронтенда и API и запустить её:

```powershell
npm.cmd run build
npm.cmd run start:prod
```

Сборка NestJS копирует веб-файлы в `dist/web`; production-сервер отдаёт сайт и API с одного адреса. Локальные данные сохраняются в `prisma/dev.db` и не попадают в Git.

## Деплой без Docker

### Render — сайт и API вместе

В репозитории есть `render.yaml`. В Render выберите **New → Blueprint**, подключите репозиторий и подтвердите создание сервиса. Blueprint собирает NestJS-приложение на Node.js и подключает постоянный диск для SQLite. Диск Render тарифицируется отдельно; без него локальная SQLite-база на хостинге не переживёт пересоздание сервиса.

После первого запуска сайт и GraphQL API будут доступны по одному адресу:

- Сайт: `https://<имя-сервиса>.onrender.com`
- GraphQL: `https://<имя-сервиса>.onrender.com/graphql`

Для одного Render-сервиса CORS не требуется менять. Если отдельно размещаете фронтенд, задайте `CORS_ORIGIN` в настройках Render точным origin Vercel, например `https://portfolio-example.vercel.app`.

### Vercel — статический сайт + API на Render

Сначала разверните API вместе с сайтом на Render по шагам выше. Затем импортируйте тот же GitHub-репозиторий в Vercel. Vercel обнаружит `vercel.json`; в настройках проекта добавьте переменную окружения `PORTFOLIO_API_URL` со значением адреса Render-сервиса без завершающего слеша, например `https://denis-durnov-portfolio.onrender.com`, после чего запустите новый деплой. Фронтенд на Vercel будет запрашивать `/graphql` у Render API.

В Render добавьте Vercel origin в `CORS_ORIGIN` (если origin несколько, укажите список через запятую). Базовый запуск не требует Vercel: команда `npm run build:vercel` локально соберёт фронтенд в `dist/vercel`; при сборке на Vercel без `PORTFOLIO_API_URL` сборка завершится явной ошибкой.

## Проверки

Тесты и production-сборка выполняются без контейнеров:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Тесты покрывают загрузку профиля, обработку ошибок API и чтение достижений опыта. Сборка статической версии для Vercel проверяется командой:

```powershell
npm.cmd run build:vercel
```

## Стек и структура

- **Фронтенд:** адаптивный HTML/CSS/JavaScript; на Render раздаётся NestJS, на Vercel размещается как статический сайт.
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
  config.js            локальная конфигурация API
scripts/
  ensure-env.cjs       создание локального .env при первом запуске
  copy-web.cjs         копирование фронтенда в production-сборку
  build-vercel.cjs     подготовка статики для Vercel
```

Исходный код: <https://github.com/goviks/denis-durnov-portfolio-api>.
