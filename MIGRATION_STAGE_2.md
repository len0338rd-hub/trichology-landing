# Этап 2 — базовая инфраструктура Next.js

Дата выполнения: 2026-07-27 (Europe/Warsaw).

## Результат этапа

В текущем непустом каталоге создана базовая инфраструктура Next.js без переноса дизайна или содержимого лендинга. Оригинальный HTML и его резервная копия сохранены побайтово.

## Версии окружения и пакетов

- Node.js: `v24.18.0` (установлен через nvm).
- npm: `11.16.0`.
- Next.js: `16.2.12`.
- React: `19.2.8`.
- React DOM: `19.2.8`.
- TypeScript: `5.9.3`.
- Tailwind CSS: `4.3.3`.
- ESLint: `9.39.5`.
- Prettier: `3.9.6`.

Next.js `16.2.12` требует Node.js `>=20.9.0`. Проект фиксирует линию Node `24.x`, соответствующую фактически использованной версии и стандартно поддерживаемую Vercel.

ESLint 10 и TypeScript 7 были проверены на совместимость до завершения установки, но не оставлены в проекте: плагины текущего `eslint-config-next` поддерживают ESLint до 9.x и TypeScript `<6.1`. Выбраны последние совместимые версии без `--force` и `--legacy-peer-deps`.

## Безопасный способ создания

Scaffold создан вручную по стандартной структуре Next.js App Router. `create-next-app` в корне не запускался. Это исключило перезапись `index.html`, `README.txt`, `reference/` и миграционных документов.

Временный scaffold не копировался поверх проекта. Глобальная версия Node.js не изменялась. Использовался только установленный через nvm Node.js из пользовательского окружения.

## Созданные файлы

```text
.
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierignore
├── MIGRATION_STAGE_2.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prettier.config.mjs
├── public/
│   ├── icons/.gitkeep
│   └── images/.gitkeep
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/.gitkeep
│   │   ├── purchase/.gitkeep
│   │   ├── sections/.gitkeep
│   │   └── ui/.gitkeep
│   ├── content/
│   │   ├── faq.ts
│   │   ├── legal.ts
│   │   ├── plans.ts
│   │   └── site.ts
│   ├── lib/
│   │   ├── env.ts
│   │   └── utils.ts
│   └── types/
│       ├── faq.ts
│       ├── plan.ts
│       └── site.ts
└── tsconfig.json
```

`node_modules/`, `.next/` и `*.tsbuildinfo` являются игнорируемыми локальными артефактами и не входят в структуру для GitHub.

## Зависимости

### Production dependencies

- `next@16.2.12`
- `react@19.2.8`
- `react-dom@19.2.8`

### Dev dependencies

- `@tailwindcss/postcss@4.3.3`
- `@types/node@24.13.3`
- `@types/react@19.2.17`
- `@types/react-dom@19.2.3`
- `eslint@9.39.5`
- `eslint-config-next@16.2.12`
- `prettier@3.9.6`
- `tailwindcss@4.3.3`
- `typescript@5.9.3`

## Настройки TypeScript

- `strict: true`.
- `noUncheckedIndexedAccess: true`.
- `forceConsistentCasingInFileNames: true`.
- `noImplicitOverride: true`.
- `noFallthroughCasesInSwitch: true`.
- `allowJs: false`.
- `noEmit: true`.
- `moduleResolution: "bundler"`.
- Next.js TypeScript plugin.
- Алиас `@/*` → `./src/*`.
- App Router находится только в `src/app/`.
- В исходном коде нет `any`, `@ts-ignore` и `@ts-nocheck`.

## Настройки Tailwind CSS

- Используется Tailwind CSS 4.
- PostCSS-плагин: `@tailwindcss/postcss`.
- Устаревший `tailwind.config.js` не создавался.
- `globals.css` импортирует `tailwindcss` и содержит только базовые глобальные правила.
- Все 11 заданных дизайн-токенов перенесены без изменения значений.
- Добавлены системный sans-serif stack и Georgia для будущих serif-заголовков.
- Добавлены `focus-visible`, smooth scrolling и `prefers-reduced-motion` fallback.
- Стили секций лендинга не переносились.

## Metadata, robots и sitemap

- `lang="ru"` установлен в root layout.
- Title и description совпадают с эталоном.
- `metadataBase` безопасно получает URL из `NEXT_PUBLIC_SITE_URL`.
- Некорректный или отсутствующий URL заменяется на `http://localhost:3000`.
- `robots.txt` разрешает индексацию и ссылается на sitemap.
- Sitemap пока содержит только главную страницу.
- `/offer` и `/privacy` не создавались.

## Переменные окружения

- Создан только `.env.example` без секретов и реальных реквизитов.
- `.env.local` отсутствовал и не создавался.
- `src/lib/env.ts` безопасно нормализует URL и допускает отсутствие необязательных публичных переменных.
- Доступ к `window` отсутствует.
- Сторонняя библиотека валидации не используется.

## npm

- Пакетный менеджер: только npm.
- `packageManager`: `npm@11.16.0`.
- `engines.node`: `24.x`.
- Корневой `package-lock.json` создан и присутствует.
- `pnpm-lock.yaml`, `yarn.lock`, `bun.lock` отсутствуют.
- Глобальные npm-пакеты не устанавливались.
- `--force` и `--legacy-peer-deps` не использовались.

Доступные команды:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run format:check
```

## Подготовка к GitHub

- Создан `.gitignore` для зависимостей, сборок, environment-файлов, Vercel state и отчётов тестов.
- `.env.example`, `package-lock.json`, эталонные файлы и документы миграции не игнорируются.
- Prettier явно исключает оба эталонных HTML и reference-материалы.
- Git в каталоге не инициализирован; `git init`, commit, push, ветки и remote не создавались.

## Подготовка к Vercel

- Используется стандартный Next.js App Router.
- Next.js находится в production dependencies.
- `package-lock.json` позволяет Vercel автоматически выбрать npm.
- `engines.node: 24.x` соответствует доступному Vercel runtime.
- Custom output, webpack, server, rewrites, redirects и headers отсутствуют.
- `vercel.json` и Vercel CLI не добавлялись.
- Custom Build Command, Install Command и Output Directory не задавались.
- Сборка не зависит от локальных абсолютных путей.

## Проверки

Выполнены последовательно:

1. `npm install` — успешно; lockfile создан.
2. `npm run format` — успешно.
3. `npm run format:check` — успешно: `All matched files use Prettier code style!`.
4. `npm run lint` — успешно, ошибок и предупреждений нет.
5. `npm run typecheck` — успешно.
6. `npm run build` — успешно на Next.js `16.2.12`; маршруты `/`, `/robots.txt`, `/sitemap.xml` статически сгенерированы.
7. `npm run dev` — сервер запущен и корректно остановлен.
8. Smoke HTTP — `/`, `/robots.txt`, `/sitemap.xml` вернули `200`.
9. В HTML dev-ответа подтверждены `<h1>Миграция сайта в процессе</h1>` и текст «Эталонный HTML сохранён в каталоге reference.».

Первая sandbox-попытка `next build` не могла создать локальный вспомогательный процесс PostCSS из-за запрета bind к локальному порту. Повторная production-сборка вне этого ограничения прошла успешно; это ограничение среды проверки, а не проекта.

## Отмеченные пункты MIGRATION_CHECKLIST.md

На этом этапе осознанно отмечены только:

1. Сохранён русский язык документа (`lang="ru"`).
2. Сохранена кодировка UTF-8.
3. Сохранён viewport.
4. Сохранён исходный title.
5. Сохранён исходный meta description.
6. Сохранено плавное перемещение по внутренним якорям.
7. Добавлена базовая поддержка `prefers-reduced-motion`.
8. Эталонный `index.html` не изменён.

Пункты Header, Hero, Trust bar, секций, тарифов, FAQ, изображений, модальных окон, JavaScript-функций и юридических документов не отмечались.

## Контроль эталона

SHA-256 до этапа:

```text
index.html            0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b
reference/index.html  0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b
```

SHA-256 после этапа:

```text
index.html            0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b
reference/index.html  0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b
```

- `cmp` после этапа: `0`.
- Размер каждого файла: 5 291 924 байта.
- Prettier и npm не изменили эталонные HTML.

## Известные ограничения

- Главная страница временная и техническая; дизайн лендинга не переносился.
- Папки компонентов пусты и содержат только `.gitkeep`.
- Content-модули содержат только типизированные пустые структуры.
- Изображения не извлекались; `public/images/` пуст.
- `.env.local` и реальные значения для Vercel ещё не заданы.
- Git ещё не инициализирован.
- `npm audit --omit=dev` для актуального Next.js `16.2.12` сообщает о трёх high advisories в транзитивных `postcss` и `sharp`. Предложенный npm автоматический fix ведёт к некорректному downgrade Next.js `9.3.3`, поэтому force-fix и неподтверждённые overrides не применялись. Следует отслеживать следующий официальный патч Next.js.
- npm 11 сообщил о неприменённых install scripts для `sharp` и `unrs-resolver`; текущие lint, typecheck, build и dev проходят успешно.

## Задачи следующего этапа

1. Повторно проверить SHA-256 эталона перед любыми изменениями.
2. Согласовать отдельный этап извлечения Base64-изображений и зафиксировать бинарные хеши.
3. Перенести контент в типизированные data-модули без изменения текстов.
4. Создать Server Components секций в фактическом порядке эталона.
5. Отдельно реализовать Client Components покупки и модальных окон.
6. Создать `/offer` и `/privacy` только при переносе полных юридических текстов.
7. Проводить визуальную и функциональную сверку по `MIGRATION_CHECKLIST.md`.

Перенос дизайна, секций, изображений, тарифов, FAQ, юридических текстов и интерактивности на этапе 2 не начинался.
