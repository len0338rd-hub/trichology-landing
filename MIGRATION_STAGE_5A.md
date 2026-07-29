# Этап 5A — статическая страница из Server Components

Дата выполнения: 2026-07-27 (Europe/Warsaw).

## Результат

Временная техническая главная страница заменена полной статической страницей Next.js. Все десять секций, Header, Footer и mobile purchase bar собраны из Server Components и получают пользовательский контент из типизированных модулей этапа 4.

Интерактивные Dialog, Clipboard, Telegram/email purchase URL, React state, event handlers, Client Components и legal routes не создавались.

## Созданные компоненты

### Layout

- `src/components/layout/SiteHeader.tsx`;
- `src/components/layout/SiteFooter.tsx`;
- `src/components/layout/MobilePurchaseBar.tsx`.

### Sections

- `src/components/sections/HeroSection.tsx`;
- `src/components/sections/TrustBar.tsx`;
- `src/components/sections/BenefitsSection.tsx`;
- `src/components/sections/ExpertiseBoundarySection.tsx`;
- `src/components/sections/GuideContentsSection.tsx`;
- `src/components/sections/IncomeCalculationSection.tsx`;
- `src/components/sections/QuoteSection.tsx`;
- `src/components/sections/InvestmentSection.tsx`;
- `src/components/sections/PricingSection.tsx`;
- `src/components/sections/FaqSection.tsx`.

### UI

- `src/components/ui/Container.tsx`;
- `src/components/ui/Button.tsx`;
- `src/components/ui/SectionHeading.tsx`;
- `src/components/ui/PriceDisplay.tsx`.

Всего создано 17 переиспользуемых Server Components. `src/app/page.tsx` также остаётся Server Component и только собирает страницу.

Соответствующие `.gitkeep` удалены из `layout/`, `sections/` и `ui/`. Каталог `src/components/purchase/` не использовался, его `.gitkeep` сохранён.

## Server/Client boundary

- Все компоненты используют Server Component boundary по умолчанию.
- Директива `"use client"` отсутствует.
- React state, effects и event handlers отсутствуют.
- `window`, `document`, `navigator`, Clipboard и `dangerouslySetInnerHTML` отсутствуют.
- Нативные `<details>/<summary>` обеспечивают работу FAQ без JavaScript.
- Статические purchase/legal buttons содержат только data attributes для будущего этапа.

## Порядок страницы

`src/app/page.tsx` рендерит:

1. `SiteHeader`.
2. `HeroSection`.
3. `TrustBar`.
4. `BenefitsSection`.
5. `ExpertiseBoundarySection`.
6. `GuideContentsSection`.
7. `IncomeCalculationSection`.
8. `QuoteSection`.
9. `InvestmentSection`.
10. `PricingSection`.
11. `FaqSection`.
12. `SiteFooter`.
13. `MobilePurchaseBar`.

В `<main>` находится ровно десять `<section>` в порядке эталона. Сохранены anchors `top`, `inside`, `plans`, `faq` и ровно один `h1`.

## Использование content

- Header, Footer и sticky bar: `headerContent`, `footerContent`, `stickyPurchaseBarContent`.
- Десять секционных data-блоков: exports из `src/content/home.ts`.
- Тарифы: единый массив `plans` и один `plans.map`.
- FAQ: единый массив `faqItems` и один `faqItems.map`.
- Изображения: `siteImages.heroConsultation` и `siteImages.scalpDiagnostics`.
- Environment fallback Footer: `env.contactEmail`.

Полные пользовательские тексты в компонентах не дублируются. Новые literal strings ограничены техническими class/ARIA-атрибутами и текстом skip-link.

## Изображения

Hero использует `next/image`:

- `src`, alt, width и height из `siteImages.heroConsultation`;
- `priority`;
- `sizes="(max-width: 950px) calc(100vw - 24px), 48vw"`;
- исходный `object-fit: cover`, radius, shadow и responsive max-height.

Expertise использует `next/image`:

- `src`, alt, width и height из `siteImages.scalpDiagnostics`;
- без `priority`;
- осмысленный `sizes`;
- исходный crop, radius и shadow.

PNG не изменялись. WebP/AVIF-файлы в репозиторий не добавлялись; runtime-оптимизацию выполняет стандартный `next/image`.

## Layout и breakpoint

- Фактический container: максимум 1100 px.
- Desktop horizontal space: 20 px с каждой стороны.
- Mobile horizontal space: 12 px с каждой стороны.
- Точные breakpoint: `950px` и `620px` через Tailwind arbitrary variants и один эквивалентный media query для базового размера body.
- Hero, expertise, income и investment: две колонки desktop, одна на `≤950px`.
- Benefits: 4/2/1 колонки.
- Pricing: 3/1 колонки.
- Guide contents: фактическая одноколоночная компоновка без gallery.
- Featured plan desktop offset снимается на `≤950px`.
- Header navigation скрывается на `≤950px`; brand name скрывается на `≤620px`.
- Mobile purchase bar показывается на `≤950px`.

Tailwind CSS 4 используется для layout, spacing, typography, borders, shadows и responsive states. В `globals.css` добавлены только базовые link/body rules, investment button overrides и нативные details states; исходный CSS целиком не копировался.

## Static button strategy

- Investment purchase CTA: `<button type="button" data-plan="guide">` через Server Component `Button`.
- Три plan CTA: `<button type="button" data-plan={plan.id}>` через `plans.map`.
- Footer legal triggers: `<button type="button" data-legal="offer|privacy">`.
- Обработчики и ARIA-обещания Dialog не добавлялись.
- Визуально кнопки соответствуют primary/ghost вариантам, но purchase/legal actions намеренно неактивны до этапа 5B.

## Footer contact fallback

Если `env.contactEmail` задан, Footer серверно создаёт рабочий `mailto:`. Если значение отсутствует, отображается `Контакты` как `span` с `aria-disabled="true"`, без выдуманного адреса и без `your@email.com`.

## Доступность

- Добавлен skip-link к `#top`.
- Сохранён один `h1` и последовательные `h2`/`h3`.
- Оба изображения используют исходные alt.
- Декоративная окружность investment имеет `aria-hidden="true"`.
- Все action buttons имеют `type="button"`.
- Существующие глобальные `focus-visible` дополнены доступными состояниями ссылок и кнопок.
- Legal/purchase buttons не маркируются как действующие Dialog.

## Проверка статической страницы

Создан read-only `scripts/verify-static-page.mjs` и npm script `page:verify`. Проверка подтверждает:

- наличие десяти section components;
- порядок imports/renders в `page.tsx`;
- ровно десять `<section>` и один `<h1>`;
- anchors `top`, `inside`, `plans`, `faq`;
- два `next/image` и оба image registry exports;
- использование `plans.map` и `faqItems.map`;
- 3 тарифа и 6 FAQ;
- static `data-plan` / `data-legal` markers;
- отсутствие `"use client"`, `onClick`, Dialog, gallery, browser API и `dangerouslySetInnerHTML`.

Первый и повторный запуск `npm run page:verify` после форматирования завершились успешно.

## Результаты команд

1. `npm run assets:extract` — успешно; четыре PNG идентичны эталонным данным.
2. `npm run content:verify` — успешно; 125 обязательных строк и ожидаемые количества подтверждены.
3. `npm run page:verify` — успешно до форматирования.
4. `npm run format` — успешно.
5. `npm run page:verify` — успешно после форматирования.
6. `npm run format:check` — успешно: `All matched files use Prettier code style!`.
7. `npm run lint` — успешно, ошибок и предупреждений нет.
8. `npm run typecheck` — успешно.
9. `npm run build` — успешно на Next.js `16.2.12`; `/`, `/robots.txt` и `/sitemap.xml` статически сгенерированы.

При финальном повторе первая sandbox-попытка build не смогла создать локальный вспомогательный PostCSS-процесс из-за запрета bind к порту (`Operation not permitted`). Повтор той же команды вне sandbox-ограничения завершился успешно. Это ограничение среды проверки, а не ошибка проекта.

## Dev smoke-test

`npm run dev` запущен на `http://localhost:3000`, проверен и корректно остановлен.

HTTP-результаты:

- `/` → `200`, 97 044 байта HTML;
- `/robots.txt` → `200`;
- `/sitemap.xml` → `200`.

В HTML главной подтверждены:

- 10 `<section>`;
- 1 `<h1>`;
- 2 `<img>` от `next/image`;
- 6 `<details>`;
- 4 static `data-plan` buttons;
- 2 static `data-legal` buttons;
- mobile purchase bar в DOM;
- 0 `<dialog>`.

Все названия десяти секций/областей, Header и Footer присутствуют. Dev-сервер не сообщил ошибок компиляции или hydration warnings.

## Чек-лист

В `MIGRATION_CHECKLIST.md` добавлен отдельный раздел этапа 5A с 33 data/implementation пунктами. Не отмечались visual screenshot comparison, pixel-perfect соответствие, Dialog, Clipboard, purchase URLs, focus trap, возврат фокуса и legal routes.

## Известные визуальные отличия и ограничения

- Screenshot comparison и visual diff намеренно не выполнялись, поэтому pixel-perfect соответствие пока не подтверждено.
- Tailwind-реализация следует фактическим размерам, цветам и breakpoint эталона, но мелкие браузерные различия typography/spacing ещё не проверялись визуально.
- `next/image` формирует responsive delivery markup вместо исходного Base64 `<img>`.
- Reveal/IntersectionObserver отсутствует; контент сразу видим, что соответствует фактическому CSS fallback эталона.
- Purchase и legal buttons пока статичны и не открывают Dialog.
- При незаполненном `NEXT_PUBLIC_CONTACT_EMAIL` Footer показывает недоступный contact fallback.
- Страницы `/offer` и `/privacy` отсутствуют.

## Контроль эталона

- SHA-256 `index.html`: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`.
- SHA-256 `reference/index.html`: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`.
- `cmp`: `0`.
- Размер каждого HTML: 5 291 924 байта.
- Hero original/public PNG: `09cad3e3d2eda2a98cc8140913c83ce43fc41827b780efb8f906792367a8d2b8`, `cmp=0`.
- Diagnostics original/public PNG: `bec183bbaa6254eaed0537799e3ebc8b094cfa0b04df2e354ff0041e0e862652`, `cmp=0`.

## Созданные и изменённые файлы

Созданы 17 component files, `scripts/verify-static-page.mjs` и `MIGRATION_STAGE_5A.md`.

Изменены:

- `src/app/page.tsx`;
- `src/app/globals.css`;
- `package.json`;
- `MIGRATION_CHECKLIST.md`.

Content/type-модули, HTML и PNG не изменялись. Новые зависимости не устанавливались.

## Задачи этапа 5B

1. Реализовать минимальные Client Component islands только для purchase/legal interactions.
2. Создать доступный purchase Dialog с выбором тарифа, focus management и закрытием по кнопке/Escape/backdrop.
3. Реализовать Clipboard с доступным статусом копирования.
4. Сформировать Telegram и purchase-email URLs из environment и чистого шаблона сообщения.
5. Реализовать legal Dialog из typed blocks без `dangerouslySetInnerHTML` либо согласовать отдельные legal routes.
6. После интерактивности отдельно выполнить keyboard и visual regression проверку.

На этапе 5A работа остановлена до реализации интерактивности.
