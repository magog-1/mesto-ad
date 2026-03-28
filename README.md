Проектная работа Mesto с подключением к API.

Ссылка на опубликованный проект: https://magog-1.github.io/mesto-ad/

## Запуск проекта

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env` в корне проекта и заполните переменные:

```env
VITE_MESTO_COHORT_ID=ваш_cohort_id
VITE_MESTO_TOKEN=ваш_токен
```

Можно использовать шаблон из файла `.env.example`.

3. Запустите проект в режиме разработки:

```bash
npm run dev
```

4. Соберите проект:

```bash
npm run build
```

5. Опубликуйте проект на GitHub Pages:

```bash
npm run deploy
```

## Автоматический деплой через GitHub Actions

В проекте настроен workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Для автоматической публикации во внешний публичный репозиторий добавьте в приватный репозиторий GitHub Secrets:

- `PUBLIC_PAGES_TOKEN` — Personal Access Token (classic) с правом `repo`.
- `PUBLIC_PAGES_REPO` — адрес публичного репозитория в формате `owner/repo`.
- `PUBLIC_PAGES_BRANCH` — (опционально) ветка публикации, по умолчанию `main`.

После этого при `push` в `main` workflow соберёт проект и отправит содержимое `dist` в публичный репозиторий.

На стороне публичного репозитория включите GitHub Pages:

- `Settings` -> `Pages`;
- `Source` -> нужная ветка (обычно `main`) и папка `/ (root)`.
