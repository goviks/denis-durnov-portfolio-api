# Денис Дурнов — портфолио

Персональный сайт-портфолио с адаптивным интерфейсом, разделами об опыте, навыках и проектах, а также контактными ссылками. Проект включает фронтенд, GraphQL API на NestJS и базу SQLite. Для локального запуска и публикации на GitHub Pages Docker не требуется.

## Сайт и контакты

- **Портфолио:** [goviks.github.io/denis-durnov-portfolio-api](https://goviks.github.io/denis-durnov-portfolio-api/)
- **GitHub:** [github.com/goviks](https://github.com/goviks)
- **Telegram:** [@goviks](https://t.me/goviks)
- **LinkedIn:** [linkedin.com/in/denis-durnov-229b65444](https://www.linkedin.com/in/denis-durnov-229b65444/)

## Технологии

- **Фронтенд:** HTML, CSS и JavaScript без отдельного фреймворка.
- **Сервер и API:** Node.js, NestJS и GraphQL.
- **Данные:** Prisma и SQLite.
- **Публикация:** GitHub Pages для статического сайта; Render — для приложения с API.

## Локальный запуск в Windows

Требуются Node.js 22.15 или новее в пределах версии 26 и npm 10 или новее. Для Windows PowerShell используйте `npm.cmd`: это позволяет запускать npm независимо от политики выполнения PowerShell-сценариев.

В PowerShell из каталога проекта выполните:

```powershell
npm.cmd ci
npm.cmd run start:dev
```

При первом запуске приложение создаст `.env`, подготовит локальную SQLite-базу `prisma/dev.db` и загрузит демонстрационный профиль.

- Сайт: <http://localhost:3000>
- GraphQL API: <http://localhost:3000/graphql>

Остановить сервер можно сочетанием `Ctrl+C`.

Для запуска через VS Code выберите задачу **Run Portfolio website (development)**.

### Production-сборка

```powershell
npm.cmd run build
npm.cmd run start:prod
```

Сайт и API будут доступны с одного Node.js-сервера. Локальная база хранится в `prisma/dev.db` и не включается в Git.

## Публикация

### GitHub Pages

Сайт публикуется автоматически при push в ветку `main` с помощью workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml). На этапе сборки актуальные данные профиля сохраняются в JSON-файл рядом со статическими ресурсами; отдельный сервер для работы опубликованной страницы не требуется.

Адрес опубликованного сайта: [goviks.github.io/denis-durnov-portfolio-api](https://goviks.github.io/denis-durnov-portfolio-api/).

### Render

Файл [`render.yaml`](render.yaml) содержит настройки сервиса. В Render выберите **New → Blueprint**, подключите репозиторий и подтвердите создание сервиса. Приложение будет обслуживать сайт и GraphQL API на одном адресе.

Для сохранения SQLite-базы между перезапусками используется постоянный диск Render. Условия и стоимость диска определяются тарифом Render.

### Vercel

Vercel размещает статический фронтенд, а GraphQL API остаётся на Render:

1. Разверните приложение на Render.
2. Импортируйте репозиторий в Vercel.
3. В переменных среды Vercel укажите `PORTFOLIO_API_URL` — полный URL сервиса Render, без завершающего слеша.
4. В переменной `CORS_ORIGIN` на Render укажите origin сайта Vercel, например `https://portfolio-example.vercel.app`.
5. Запустите деплой Vercel.

Параметры статической сборки заданы в [`vercel.json`](vercel.json). Для локальной проверки сборки выполните `npm.cmd run build:vercel`.

## Тесты и сборки

Запустить тесты и production-сборку:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Проверить сборку для GitHub Pages или Vercel:

```powershell
npm.cmd run build:pages
npm.cmd run build:vercel
```

## Структура проекта

```text
.github/workflows/
  deploy-pages.yml       публикация на GitHub Pages
prisma/
  schema.prisma          схема базы данных
  seed.ts                исходные данные профиля
scripts/
  build-pages.cjs        сборка статического сайта для Pages
  build-vercel.cjs       сборка фронтенда для Vercel
  copy-web.cjs           копирование фронтенда в NestJS-сборку
  ensure-env.cjs         создание .env при первом запуске
src/
  main.ts                запуск NestJS, API и раздача фронтенда
  profile/               GraphQL-resolver, сервис и модели профиля
web/
  index.html             структура страницы
  styles.css             адаптивные стили
  app.js                 загрузка и отображение данных профиля
  config.js              конфигурация источника данных
```

## Репозиторий

[github.com/goviks/denis-durnov-portfolio-api](https://github.com/goviks/denis-durnov-portfolio-api)
