# Этап 4 — фиксация типизированного контента

Дата выполнения: 2026-07-27 (Europe/Warsaw).

## Результат этапа

Полный текстовый контент, конфигурация, тарифы, FAQ, подписи покупки, шаблон сообщения и два юридических шаблона перенесены из неизменяемого `reference/index.html` в строгие TypeScript-модули.

JSX, React-компоненты лендинга, Client Components, визуальная стилизация и подключение данных к `page.tsx` на этапе не создавались. Единственное разрешённое изменение существующего React-кода — получение title и description в `src/app/layout.tsx` из единого `siteMetadata`.

## Окружение

- Node.js: `v24.18.0`.
- npm: `11.16.0`.
- Новые npm-зависимости не устанавливались.
- Пакетный менеджер: только npm.

## Контроль эталона

- Источник: `reference/index.html`.
- SHA-256 до этапа: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`.
- SHA-256 после этапа: `0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b`.
- SHA-256 корневого `index.html`: тот же.
- Размер каждого HTML: 5 291 924 байта.
- `cmp` между HTML-файлами: `0`.
- Эталонные HTML не форматировались и не изменялись.

## Content-модули и exports

### `src/content/site.ts`

- `siteMetadata`;
- `publicAnchorIds`;
- `headerContent`;
- `footerContent`;
- `stickyPurchaseBarContent`;
- `siteConfig`.

### `src/content/home.ts`

- `heroContent`;
- `trustBarContent`;
- `benefitsContent`;
- `expertiseBoundaryContent`;
- `guideContentsContent`;
- `incomeCalculationContent`;
- `quoteContent`;
- `investmentContent`;
- `pricingIntroContent`;
- `faqIntroContent`;
- `homeSectionOrder`;
- `homeContent`.

### Остальные content-модули

- `src/content/plans.ts` → `plans`;
- `src/content/faq.ts` → `faqItems`;
- `src/content/legal.ts` → `legalDocuments`, `legalDialogContent`;
- `src/content/purchase.ts` → `paymentDetailDefinitions`, `purchaseDialogContent`;
- `src/content/images.ts` → существующий `siteImages`, не изменён.

Все статические content exports используют `as const satisfies ...`, где это применимо.

## Типы

### Обновлены

- `src/types/site.ts` — metadata, anchors, navigation, brand, Header, Footer, contact type, sticky bar и общая site configuration.
- `src/types/plan.ts` — добавлен обязательный `ctaLabel`; цены остаются числами.
- `src/types/faq.ts` — добавлены шесть стабильных `FaqId` и обязательный `id`.

### Созданы

- `src/types/content.ts` — десять видов секционного контента, headings, prices, CTA, cards, modules, calculation, quote и investment comparison.
- `src/types/legal.ts` — legal paragraphs/lists и discriminated dynamic blocks `seller-details` / `privacy-contact`.
- `src/types/purchase.ts` — payment definitions, dialog labels и message input/template.

Не использованы `any`, обход типов через `unknown`, `@ts-ignore`, `@ts-nocheck`, изменяемые статические массивы, JSX, React imports или DOM/browser API в content/type-модулях.

## Количества перенесённых данных

- Секционные data-объекты в фактическом порядке: 10.
- Header: 1 brand, 2 navigation links, 1 CTA.
- Trust items: 4.
- Benefit cards: 4.
- Expertise checklist items: 3.
- Guide modules: 5.
- Income calculation: 3 отображаемых операнда и 1 результат.
- Investment points: 3.
- Comparison formats: 2.
- Plans: 3.
- FAQ: 6.
- Legal documents: 2.
- Payment detail definitions: 3.
- CTA labels: 11 — Header 1, Hero 2, Investment 2, plans 3, sticky bar 1, purchase dialog 2. Footer legal/contact actions и close/copy labels учтены отдельно и в это число не включены.

## Тарифы

| ID        | Текущая цена | Старая цена | Валюта | Featured |
| --------- | -----------: | ----------: | ------ | -------- |
| `guide`   |           79 |         100 | PLN    | нет      |
| `ai`      |          179 |         249 | PLN    | да       |
| `premium` |          499 |         599 | PLN    | нет      |

Порядок `guide` → `ai` → `premium` сохранён. Все цены имеют числовой тип.

## FAQ и legal

- FAQ перенесены в количестве 6, в исходном порядке и с полными ответами.
- Legal documents перенесены в количестве 2: `offer` и `privacy`.
- Юридические формулировки не редактировались.
- Legal HTML strings заменены typed blocks; `dangerouslySetInnerHTML` не используется.
- Placeholder продавца заменён block type `seller-details`.
- Placeholder privacy email заменён block type `privacy-contact`.
- Страницы `/offer` и `/privacy` не создавались.

## Purchase data и сообщения

- Зафиксированы точные подписи диалога, оплаты, копирования, успешного копирования, доставки и contact CTA.
- Три строки оплаты описаны через `PaymentDetailDefinition` и environment keys.
- Создана pure function `createPurchaseMessage()` в `src/lib/purchase-message.ts`.
- Функция воспроизводит формат: `Здравствуйте! Я оплатила формат «{planName}» за {price} {currency}. Отправляю чек.`
- Telegram URL и `mailto:` пока не создаются.
- Clipboard и Dialog не реализуются на этом этапе.

## Structural transformations

1. Цена-строка преобразована в число, отдельную валюту и, где нужно, prefix/old price/crossed-out flag.
2. `<em>` в Hero преобразован в `before` и `emphasis`.
3. HTML-списки и карточки преобразованы в readonly arrays.
4. Image `src` в секционных данных заменён существующим semantic `imageId`.
5. `data-plan` преобразован в строгий `PlanId`.
6. Юридические HTML-строки преобразованы в discriminated typed blocks.
7. Контактные и платёжные placeholders заменены environment definitions или dynamic legal blocks.
8. Исходная message template literal преобразована в pure typed function.

Это только структурные преобразования. Контент не сокращался, не перефразировался и не исправлялся.

## Динамические environment fields

Существующий `src/lib/env.ts` уже безопасно экспортирует все необходимые поля:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_TELEGRAM_USERNAME`;
- `NEXT_PUBLIC_CONTACT_EMAIL`;
- `NEXT_PUBLIC_PAYMENT_RECIPIENT`;
- `NEXT_PUBLIC_PAYMENT_ACCOUNT`;
- `NEXT_PUBLIC_PAYMENT_PURPOSE`.

`.env.example` и `src/lib/env.ts` менять не потребовалось. `NEXT_PUBLIC_SELLER_DETAILS` не добавлялся: реальное значение продавца не задано, а legal content содержит явный dynamic block.

## Исходные placeholders, не перенесённые как рабочие значения

- `YOUR_TELEGRAM`;
- `your@email.com`;
- `УКАЖИТЕ РЕКВИЗИТЫ`;
- `УКАЖИТЕ ИМЯ`;
- `УКАЖИТЕ ИМЯ / СТАТУС / КОНТАКТЫ`.

Они остаются зафиксированы только в эталонном HTML, аудите и `reference/CONTENT_MANIFEST.md`.

## Safeguard контента

Создан `scripts/verify-content.mjs`, использующий только стандартные модули Node.js. Он:

1. Проверяет SHA-256 полного `reference/index.html`.
2. Проверяет явный реестр из 125 обязательных исходных строк.
3. Проверяет 10 секций, 3 тарифа, 6 FAQ, 5 guide modules, 4 benefit cards, 4 trust items и 2 dialog.
4. Проверяет цены, публичные anchors, CTA и FAQ-вопросы.
5. Проверяет наличие content-файлов и обязательных exports.
6. Проверяет числовые plan prices, количество typed plans/FAQ/legal docs и dynamic legal blocks.
7. Не допускает исходные контактные/платёжные placeholders в production TypeScript-контенте.
8. Не изменяет файлы и не пытается исполнять TypeScript или React.

В `package.json` добавлена команда `npm run content:verify`. Другие scripts не удалялись и не менялись.

## Результаты проверок

Последовательность этапа:

1. `npm run assets:extract` — успешно; четыре PNG существуют и идентичны ожидаемым бинарным данным.
2. Первый `npm run content:verify` — успешно.
3. Повторный `npm run content:verify` перед форматированием — успешно.
4. `npm run format` — успешно; эталонные HTML исключены и не изменены.
5. `npm run content:verify` после форматирования — успешно.
6. `npm run format:check` — успешно: `All matched files use Prettier code style!`.
7. `npm run lint` — успешно, ошибок и предупреждений нет.
8. `npm run typecheck` — успешно.
9. `npm run build` — успешно на Next.js `16.2.12`; `/`, `/robots.txt` и `/sitemap.xml` статически сгенерированы.

При финальном повторе первая sandbox-попытка build не смогла создать локальный вспомогательный PostCSS-процесс из-за запрета bind к порту (`Operation not permitted`). Повтор той же команды вне этого ограничения завершился успешно. Это ограничение среды проверки, а не ошибка проекта.

## Изображения

Финальная повторная проверка подтвердила:

- Hero original/public SHA-256: `09cad3e3d2eda2a98cc8140913c83ce43fc41827b780efb8f906792367a8d2b8`, `cmp=0`.
- Diagnostics original/public SHA-256: `bec183bbaa6254eaed0537799e3ebc8b094cfa0b04df2e354ff0041e0e862652`, `cmp=0`.

PNG не менялись и не подключались к React.

## Созданные файлы

```text
MIGRATION_STAGE_4.md
reference/CONTENT_MANIFEST.md
scripts/verify-content.mjs
src/content/home.ts
src/content/purchase.ts
src/lib/purchase-message.ts
src/types/content.ts
src/types/legal.ts
src/types/purchase.ts
```

## Изменённые файлы

```text
MIGRATION_CHECKLIST.md
package.json
src/app/layout.tsx
src/content/faq.ts
src/content/legal.ts
src/content/plans.ts
src/content/site.ts
src/types/faq.ts
src/types/plan.ts
src/types/site.ts
```

`package-lock.json` и зависимости не изменялись, потому что новая npm-команда не требует установки пакетов.

## Отмеченные пункты чек-листа

В отдельном разделе «Этап 4 — фиксация типизированного контента» отмечены 17 data-only пунктов:

1. Metadata.
2. Header и anchors.
3. Hero data.
4. Trust bar data.
5. Benefits data.
6. Expertise data.
7. Guide modules data.
8. Calculation data.
9. Quote data.
10. Investment data.
11. Pricing/FAQ intros.
12. Plans data.
13. FAQ data.
14. Footer/sticky data.
15. Purchase/payment/message data.
16. Legal templates.
17. Numeric typed prices.

Исходные visual/functional checkbox не отмечались.

## Подтверждение границ этапа

- В `src/components/` нет файлов, кроме существующих `.gitkeep`.
- Новые `.tsx` не создавались; существуют только инфраструктурные `src/app/layout.tsx` и `src/app/page.tsx`.
- `"use client"` отсутствует.
- Контент не импортируется в `page.tsx`.
- Секции лендинга, дизайн, Dialog, Clipboard и contact URLs не реализовывались.
- Изображения не подключались через `next/image`.
- Реальные реквизиты и контакты не добавлялись.
- Git не инициализирован; commit и push не выполнялись.

## Задачи следующего этапа

1. Повторно проверить эталонные SHA-256 перед следующими изменениями.
2. Создать Server Components визуальных секций в фактическом порядке, используя готовые content exports.
3. Подключить оба semantic image ID через `next/image` при переносе Hero и expertise.
4. Воспроизвести исходную desktop/tablet/mobile композицию и только затем проводить визуальное сравнение.
5. Оставить purchase Dialog, Clipboard, Telegram/email URL и другие Client Components для отдельного этапа интерактивности.
6. Создать юридические страницы или dialog UI только на согласованном последующем этапе.

На этапе 4 визуальный перенос лендинга не начинался.
