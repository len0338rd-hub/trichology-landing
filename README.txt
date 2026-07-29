Версия без изображений в блоке «Что внутри». Оставлены главное фото, другие разделы и превью страниц гайда.

ПОДКЛЮЧЕНИЕ STRIPE

Проект подготовлен для Stripe Checkout. До добавления настроек кнопка Stripe видна, но недоступна; текущая оплата по реквизитам продолжает работать.

1. Примите приглашение партнёра в Stripe и сначала работайте в sandbox/test mode.
2. В Stripe создайте по одному одноразовому Price в PLN для каждого тарифа: 79, 179 и 499 PLN. Названия и цены должны совпадать с src/content/plans.ts.
3. Скопируйте .env.example в .env.local и заполните:
   - STRIPE_SECRET_KEY — серверный test secret key;
   - STRIPE_PRICE_GUIDE — Price ID тарифа «Практический гайд»;
   - STRIPE_PRICE_AI — Price ID тарифа «Гайд + AI-ассистент»;
   - STRIPE_PRICE_PREMIUM — Price ID тарифа «Премиум-внедрение»;
   - NEXT_PUBLIC_SITE_URL — полный адрес сайта.
4. В Stripe добавьте webhook endpoint:
   https://АДРЕС-САЙТА/api/stripe/webhook
   События: checkout.session.completed и checkout.session.async_payment_succeeded.
5. Скопируйте signing secret этого endpoint в STRIPE_WEBHOOK_SECRET.
6. Перезапустите сайт и проведите тестовую оплату. Для live-режима замените test key, Price ID и webhook secret на live-значения.

Секретные значения нельзя отправлять в чат, добавлять в NEXT_PUBLIC_* или коммитить. Их нужно вводить только в защищённые переменные окружения хостинга.

Webhook уже проверяет подпись Stripe и подтверждает статус платежа. Автоматическая отправка PDF/доступа пока не подключена: точка интеграции находится в src/lib/stripe-fulfillment.ts.
