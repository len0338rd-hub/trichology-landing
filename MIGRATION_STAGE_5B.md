# Этап 5B — визуальная и адаптивная сверка

Дата выполнения: 2026-07-27 (Europe/Warsaw).

## Результат

Статическая Next.js-страница сопоставлена с неизменяемым `reference/index.html` в Chromium на desktop, tablet, mobile и четырёх границах breakpoint. Исправлены обнаруженные расхождения layout, typography и responsive-переключений. Все десять секций, оба изображения, три тарифа, шесть FAQ, Header, Footer и mobile purchase bar присутствуют и сохраняют порядок эталона.

Интерактивность не добавлялась: purchase/legal buttons остаются статическими, Client Components, Dialog, Clipboard, Telegram/email purchase URL и legal routes отсутствуют.

## Окружение

- Node.js: `v24.18.0`.
- npm: `11.16.0`.
- Next.js: `16.2.12`.
- Playwright: `1.62.0`.
- Package manager остаётся npm; `package-lock.json` обновлён.
- Другие lock-файлы и новые runtime dependencies не создавались.

## Инструменты и запуск

- Visual runner: `@playwright/test` `1.62.0`, установленный единственной новой dev dependency.
- Browser: Playwright Chromium `151.0.7922.34` (`chromium-1234`), headless.
- Reference server: `npm run reference:serve`, `http://127.0.0.1:4173/`.
- Next.js server: `npm run dev -- --hostname 127.0.0.1`, `http://127.0.0.1:3000/`.
- Reference server слушает только `127.0.0.1:4173`, отдаёт неизменённый `reference/index.html` как UTF-8 и корректно завершает работу по `SIGINT`/`SIGTERM`.
- `deviceScaleFactor: 1`, locale `ru-RU`, timezone `Europe/Warsaw`, light color scheme.
- До screenshot ожидаются изображения и `document.fonts.ready`, закрываются `<details>`, scroll возвращается наверх, transitions/animations отключаются.

Baseline один раз создан командой `npm run visual:update` исключительно из `reference/index.html`. После исправлений Next.js reference screenshots не обновлялись.

## Viewport

Основные full-page screenshots:

1. Desktop — `1440 × 1100`.
2. Tablet — `900 × 1100`.
3. Mobile — `390 × 844`.

Границы breakpoint:

1. `951 × 1000`.
2. `950 × 1000`.
3. `621 × 900`.
4. `620 × 900`.

## Screenshots

Reference:

- `tests/visual/reference/homepage-desktop.png`;
- `tests/visual/reference/homepage-tablet.png`;
- `tests/visual/reference/homepage-mobile.png`;
- `tests/visual/reference/breakpoint-951.png`;
- `tests/visual/reference/breakpoint-950.png`;
- `tests/visual/reference/breakpoint-621.png`;
- `tests/visual/reference/breakpoint-620.png`.

Next.js current:

- `tests/visual/current/homepage-desktop.png`;
- `tests/visual/current/homepage-tablet.png`;
- `tests/visual/current/homepage-mobile.png`;
- `tests/visual/current/breakpoint-951.png`;
- `tests/visual/current/breakpoint-950.png`;
- `tests/visual/current/breakpoint-621.png`;
- `tests/visual/current/breakpoint-620.png`.

Все screenshots формируются автоматически, имеют `deviceScaleFactor: 1`, не редактировались графическими инструментами и не содержат Base64.

## Найденные расхождения

1. Sans-serif stack начинался с `ui-sans-serif`, тогда как эталон начинает с `Inter` с системным fallback.
2. Глобальный shorthand `font: inherit` для links/buttons перекрывал Tailwind font-size/font-weight utilities.
3. Header использует отдельную ширину выравнивания 1180px, а секции — фактический container 1100px.
4. В Hero отличались line-height, вертикальные интервалы price line и размер основной цены.
5. У eyebrow, Trust bar, navigation, plan labels, FAQ summary и других компактных подписей не везде был явно сохранён исходный `line-height: 1.5`.
6. Несколько `h3` потеряли исходное полужирное начертание из-за browser reset/Tailwind preflight.
7. Отличались небольшие интервалы в Expertise, Investment, Pricing и Footer.
8. Сумма расчёта на mobile ошибочно уменьшалась до 28px вместо исходных 30px.
9. Верхний margin блока экономии был 12px вместо исходных 10px.
10. Mobile plan notes имели размер 12.5px вместо фактического исходного 11.6667px.
11. Tailwind CSS 4 трактует `max-[950px]` и `max-[620px]` как строгие `<950`/`<620`, поэтому точные точки 950px и 620px первоначально оставались в предыдущем режиме.
12. Footer требовал дополнительного нижнего пространства при видимой fixed mobile purchase bar.

## Исправления

- Восстановлен исходный font stack с `Inter` первым и безопасными системными fallback.
- Shorthand `font` заменён на наследование только `font-family`, `font-size` и `line-height`, чтобы utility weights/sizes применялись корректно.
- Header выровнен по исходной ширине 1180px; секционные containers сохранены на 1100px.
- Уточнены Hero price line, typography, spacing и inline/flex-разметка `PriceDisplay`.
- Добавлены точные line-height/font-weight/spacing значения для статических секций.
- Исправлены mobile income result, Expertise list margin, Investment savings margin и Pricing note size.
- Responsive variants технически записаны как `max-[951px]` и `max-[621px]`: в Tailwind CSS 4 это даёт требуемые включительные состояния `≤950px` и `≤620px`, не затрагивая 951px и 621px.
- Footer сохраняет дополнительные 68px нижнего пространства на `≤950px`, чтобы fixed mobile purchase bar не перекрывала контент.
- Добавлены стабильные `data-testid` только для read-only layout assertions; они не меняют UI и поведение.

## Visual comparison

`tests/visual/homepage.visual.spec.ts`:

- всегда получает reference screenshot из `http://127.0.0.1:4173/`;
- сохраняет фактический Next.js screenshot в `tests/visual/current/`;
- сравнивает Next.js с reference при `threshold: 0.2` и `maxDiffPixelRatio: 0.025`;
- не использует Next.js screenshot как baseline;
- перед сравнением только на `≤950px` нормализует дополнительный Footer padding, чтобы намеренное безопасное пространство под fixed bar не считалось регрессией; фактические current screenshots сохраняются до нормализации;
- проверяет отсутствие console errors и CLS `≤0.02`.

После исправлений геометрия содержимого совпадает с эталоном: высота desktop — 6782px; tablet/mobile отличаются только документированными дополнительными 68px Footer padding под mobile purchase bar.

## Breakpoint assertions

- `951px`: navigation видима, mobile bar скрыта, Hero/Pricing остаются desktop grids, featured plan имеет desktop offset.
- `950px`: navigation скрыта, mobile bar видима, Hero/Pricing становятся одноколоночными, featured offset равен нулю.
- `621px`: brand text видим, Benefits имеют две колонки, comparison/savings/Footer остаются горизонтальными.
- `620px`: brand text скрыт, Benefits имеют одну колонку, comparison/savings/Footer складываются вертикально, Hero CTA полноширинные, horizontal padding равен 12px.

Все assertions проходят.

## Overflow и изображения

Для всех семи viewport подтверждено:

```text
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Горизонтальный overflow отсутствует.

Изображения:

- оба имеют intrinsic `width="1448"` и `height="1086"`;
- оба используют `object-fit: cover` и исходные responsive crop/radius/shadow;
- Hero image предзагружается и не является lazy;
- diagnostics image использует `loading="lazy"`;
- `next/image` резервирует размеры, CLS во всех visual tests не выше 0.02;
- alt совпадают с `siteImages`;
- PNG в `public/images` и `reference/assets-original` не изменялись.

## Accessibility smoke-check

- ровно один `h1`, семь `h2`, двенадцать `h3` и десять `<section>`;
- skip-link первым получает keyboard focus и имеет видимый outline;
- `<details>/<summary>` открываются и закрываются клавишей Enter;
- все изображения имеют исходные alt;
- все buttons имеют видимый текст и `type="button"`;
- anchors `top`, `inside`, `plans`, `faq` уникальны;
- некорректный ARIA не добавлялся;
- console errors и hydration warnings отсутствуют.

## Допустимые оставшиеся отличия

- `next/image` генерирует `srcset`, preload и оптимизированную delivery-разметку вместо Base64 `<img>`.
- Возможны минимальные отличия text anti-aliasing Chromium.
- При пустом `NEXT_PUBLIC_CONTACT_EMAIL` Footer показывает недоступный `Контакты` вместо исходной рабочей заглушки `your@email.com`.
- Reveal отсутствует, потому что в фактическом эталоне он принудительно отключён CSS.
- Purchase/legal buttons остаются статическими и пока не открывают Dialog.
- Дополнительные 68px нижнего Footer padding на `≤950px` предотвращают перекрытие fixed mobile bar и намеренно сохранены.

## Чек-лист

В `MIGRATION_CHECKLIST.md` добавлен отдельный раздел этапа 5B с 20 осознанно отмеченными visual/responsive/accessibility пунктами. Dialog, Clipboard, Telegram/email purchase URL, focus trap, возврат фокуса, legal routes, deploy и финальное функциональное соответствие не отмечались.

## Результаты проверок

1. `npm run assets:extract` — успешно; два Base64 PNG и четыре файловые копии идентичны ожидаемым данным.
2. `npm run content:verify` — успешно; 10 секций, 3 тарифа, 6 FAQ и 125 обязательных строк подтверждены.
3. `npm run page:verify` — успешно до и после форматирования; 17 Server Components, 10 section components, 2 `next/image`, 3 тарифа и 6 FAQ.
4. Первый `npm run visual:test` — успешно: 8 из 8 тестов.
5. `npm run format` — успешно; эталонные HTML исключены из форматирования.
6. Повторный `npm run visual:test` — успешно: 8 из 8 тестов.
7. `npm run format:check` — успешно: `All matched files use Prettier code style!`.
8. `npm run lint` — успешно, ошибок и предупреждений нет.
9. `npm run typecheck` — успешно.
10. `npm run build` — успешно; `/`, `/robots.txt` и `/sitemap.xml` статически сгенерированы Next.js.

Установка dependency сообщила о 12 high severity issues в транзитивном дереве. `npm audit fix` и `npm audit fix --force` не запускались согласно ограничениям этапа; версии проекта не менялись автоматически.

## Dev smoke-test и контроль эталона

Локальный dev-сервер ответил:

- `/` — HTTP 200, 99 500 байт HTML;
- `/robots.txt` — HTTP 200;
- `/sitemap.xml` — HTTP 200.

В главной подтверждены 10 `<section>`, 1 `<h1>`, 2 `<img>`, 6 `<details>`, 4 `data-plan` buttons, 2 `data-legal` buttons, 0 `<dialog>` и все четыре публичных anchor. Ошибок компиляции и hydration warnings нет. Принудительная прокрутка full-page visual test вызывает только dev-warning Next.js о том, что lazy diagnostics image временно стала LCP; это артефакт тестовой прокрутки, изображение по требованиям остаётся lazy.

После smoke-test локальные серверы на портах 3000 и 4173 корректно остановлены.

Финальная integrity-проверка:

- SHA-256 `index.html`: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`;
- SHA-256 `reference/index.html`: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`;
- `cmp exit code: 0`;
- размер каждого HTML: 5 291 924 байта;
- повторный `npm run assets:extract` подтвердил оба PNG и обе рабочие копии.

## Файлы этапа

Созданы:

- `playwright.config.ts`;
- `scripts/serve-reference.mjs`;
- `tests/visual/homepage.visual.spec.ts`;
- 7 reference screenshots;
- 7 current screenshots;
- `MIGRATION_STAGE_5B.md`.

Изменены:

- `package.json`;
- `package-lock.json`;
- `src/app/globals.css`;
- Server Components с визуальными/responsive className;
- `MIGRATION_CHECKLIST.md`.

Content-модули, HTML, PNG и тексты не изменялись.

## Задачи этапа 6

1. Создать минимальные Client Component islands только для purchase/legal interactions.
2. Реализовать доступные purchase и legal Dialog с Escape/backdrop close, focus trap и возвратом фокуса.
3. Реализовать Clipboard с доступным состоянием «Скопировано».
4. Сформировать Telegram и purchase-email URL из environment и типизированных шаблонов.
5. Подставлять payment/contact/seller data только из environment без исходных заглушек.
6. Добавить функциональные Playwright tests, сохранив текущие visual baselines неизменными.
7. Повторить keyboard, responsive и visual regression после добавления интерактивности.

На этапе 5B работа остановлена до создания Client Components и интерактивности.
