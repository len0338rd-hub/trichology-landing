# Этап 6A — интерактивный процесс покупки

Дата выполнения: 27 июля 2026 года  
Node.js: `v24.18.0`  
npm: `11.16.0`

## Результат

Создан минимальный клиентский остров покупки. Четыре CTA открывают нативный `buyDialog`, выбранный тариф берётся из единого массива `plans`, а реквизиты и контактная конфигурация передаются с серверной стороны через сериализуемые props. Legal-кнопки остались статическими.

## Client Components

- `src/components/purchase/PurchaseProvider.tsx`;
- `src/components/purchase/PurchaseButton.tsx`;
- `src/components/purchase/PurchaseDialog.tsx`;
- `src/components/purchase/PaymentDetailRow.tsx`.

Ровно эти четыре файла содержат директиву `"use client"`. `page.tsx`, layout, Header, Footer, десять секций и UI-компоненты остаются Server Components. Server Components передаются в Provider через `children`, поэтому их разметка не была перенесена в клиентские компоненты.

## Provider и выбор тарифа

Provider хранит только:

- `selectedPlanId`;
- `isPurchaseDialogOpen`.

Начальный и резервный тариф — `guide`. Объект тарифа каждый раз находится в `plans`; данные тарифов в Provider не дублируются. Неизвестный runtime ID безопасно приводит к `guide`. Доступные действия: `openPurchase(planId)` и `closePurchase()`.

Подключены четыре trigger:

1. Investment CTA → `guide`;
2. «Выбрать гайд» → `guide`;
3. «Выбрать гайд + AI» → `ai`;
4. «Выбрать премиум» → `premium`.

## Environment configuration

`page.tsx` читает текущий `src/lib/env.ts`, формирует `PurchaseConfiguration` и передаёт только строковые публичные значения Provider:

- `NEXT_PUBLIC_TELEGRAM_USERNAME`;
- `NEXT_PUBLIC_CONTACT_EMAIL`;
- `NEXT_PUBLIC_PAYMENT_ACCOUNT`;
- `NEXT_PUBLIC_PAYMENT_RECIPIENT`;
- `NEXT_PUBLIC_PAYMENT_PURPOSE`.

Если значение отсутствует, приложение не падает. Платёжная строка показывает «Не указано», её copy-кнопка отключена, а Telegram/email показываются как недоступные элементы без `href`. Исходные placeholders не используются как рабочие значения.

## Dialog, Clipboard и ссылки

`PurchaseDialog` использует нативный `<dialog id="buyDialog">`, `showModal()` и `close()`. Поддержаны кнопка `×`, Escape, клик непосредственно по backdrop и игнорирование клика внутри содержимого.

Каждая строка реквизитов управляет своим Clipboard-состоянием. После успешного `navigator.clipboard.writeText()` текст меняется на «Скопировано» и через `1200` мс возвращается к «Копировать». Ошибка обрабатывается без stack trace текстом «Не удалось скопировать». Таймер очищается при unmount; live region сообщает результат assistive technology.

`src/lib/purchase-links.ts` содержит чистые функции:

- Telegram: `https://t.me/USERNAME?text=ENCODED_MESSAGE`; пробелы и ведущий `@` удаляются, сообщение формируется через `createPurchaseMessage`;
- email: `mailto:RECIPIENT?subject=ENCODED_SUBJECT&body=ENCODED_MESSAGE`.

Функции не используют browser API и возвращают `null` при пустом получателе.

## Фокус и доступность

- Dialog связан с выбранным названием тарифа через `aria-labelledby`.
- Кнопка закрытия имеет имя «Закрыть окно покупки».
- При открытии фокус переходит на кнопку закрытия.
- Tab/Shift+Tab замкнуты внутри нативного dialog без сторонней библиотеки.
- После любого закрытия фокус возвращается на фактический trigger.
- Disabled CTA и copy-кнопки не получают фокус.

## Стили

Перенесены ширина `min(620px, calc(100% - 28px))`, surface, radius `24px`, shadow, backdrop blur, внутренний scroll и responsive actions. На `≤620px` реквизиты и нижние actions складываются вертикально. Закрытый dialog не влияет на layout страницы.

## Functional tests

Созданы:

- `playwright.functional.config.ts`;
- `tests/functional/purchase.spec.ts`;
- `tests/functional/purchase-empty.spec.ts`;
- `scripts/verify-purchase.mjs`.

Filled-режим использует только очевидно тестовые значения в `webServer.env`. Empty-режим запускается отдельно с пустыми значениями. В production `.env.example` тестовые реквизиты не добавлялись.

Проверены:

- четыре trigger и три тарифа;
- название, текущая и старая цена;
- закрытие кнопкой, Escape и backdrop;
- отсутствие закрытия по клику внутри;
- три Clipboard-строки, точное значение, временный feedback и независимость;
- Telegram и email URL;
- безопасный empty fallback;
- доступное имя dialog и close button;
- Tab containment и focus return.

Результат `npm run functional:test`: `11 passed` в filled-режиме и `1 passed` в empty-режиме.

## Screenshots открытого dialog

- `tests/functional/screenshots/purchase-guide-desktop.png` — `1440 × 1100`;
- `tests/functional/screenshots/purchase-ai-mobile.png` — `390 × 844`;
- `tests/functional/screenshots/purchase-premium-tablet.png` — `900 × 1100`.

Снимки созданы Playwright без графического редактирования и просмотрены вручную.

## Проверки

- `npm run assets:extract` — успешно;
- `npm run content:verify` — успешно;
- `npm run page:verify` — успешно;
- `npm run purchase:verify` — успешно, 4 Client Components и 4 trigger;
- `npm run format:check` — успешно;
- `npm run lint` — успешно;
- `npm run typecheck` — успешно;
- `npm run build` — успешно;
- `npm run visual:test` — `8 passed`;
- `npm run functional:test` — `11 passed` + `1 passed`.

Обычный `npm run dev -- --hostname 127.0.0.1` запустился без ошибок. `/`, `/robots.txt` и `/sitemap.xml` ответили HTTP `200`; SSR-ответ главной содержит 10 секций, один `h1`, два изображения, шесть FAQ, четыре purchase trigger и `buyDialog`. Dev-сервер после проверки корректно остановлен.

Финальные результаты повторно фиксируются полным прогоном после форматирования этого документа.

## Чек-лист

В `MIGRATION_CHECKLIST.md` отмечены только фактически реализованные и проверенные purchase-пункты с пометкой `[этап 6A]`: выбор тарифа, dialog, цены, реквизиты, Clipboard, Telegram/email URL, empty fallback, способы закрытия, focus containment/return и mobile actions.

## Ограничения

- Реальные environment values не добавлялись и не проверялись.
- Telegram и email проверены на синтетических `.invalid`/test-значениях; внешняя доставка не выполнялась.
- Интерактивная browser-проверка выполнена в Chromium через Playwright; подключаемый UI-браузер окружения был недоступен. Functional suite дополнительно проверяет отсутствие console errors и hydration errors.
- Платёжный API, backend и production checkout отсутствуют.
- Legal dialog, обработчики `data-legal`, `/offer` и `/privacy` не создавались.
- Git в каталоге не инициализирован; commit/push не выполнялись.

## Задачи этапа 6B

- реализовать отдельный минимальный legal island;
- открывать offer/privacy по существующим `data-legal` triggers;
- выводить типизированные legal blocks и динамические seller/contact fields;
- проверить Escape, backdrop, focus containment и focus return legal dialog;
- добавить функциональные тесты legal-сценариев, не смешивая их с purchase state.
