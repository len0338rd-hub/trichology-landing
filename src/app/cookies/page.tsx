import type { Metadata } from "next";
import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { COOKIE_CONSENT_NAME } from "@/lib/cookie-consent";

export const metadata: Metadata = {
  title: "Политика cookies | Эстетическая трихология",
  description: "Информация о cookies и настройках согласия на сайте.",
};

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-12 text-foreground sm:py-16">
      <article className="mx-auto max-w-[820px] rounded-3xl bg-white p-7 shadow-[0_22px_55px_rgba(63,43,32,0.12)] sm:p-12">
        <p className="mb-3 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">
          Информация для пользователей из Польши и ЕС
        </p>
        <h1 className="mt-0 mb-6 font-serif text-[42px] leading-[1.08] font-medium max-[620px]:text-[34px]">
          Политика использования cookies
        </h1>
        <p className="text-muted">Последнее обновление: 29 июля 2026 года.</p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          1. Что такое cookies
        </h2>
        <p>
          Cookies — это небольшие текстовые данные, которые сайт сохраняет в
          браузере пользователя. Похожие технологии хранения данных подпадают
          под те же настройки согласия.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          2. Какие cookies использует сайт
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3">Название</th>
                <th className="p-3">Категория и цель</th>
                <th className="p-3">Срок</th>
                <th className="p-3">Поставщик</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-mono">{COOKIE_CONSENT_NAME}</td>
                <td className="p-3">
                  Необходимый — сохраняет выбранные пользователем настройки
                  cookies
                </td>
                <td className="p-3">180 дней</td>
                <td className="p-3">Этот сайт</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Сейчас на сайте не установлены аналитические cookies и рекламные
          пиксели. Если такие инструменты будут добавлены, они не должны
          запускаться до соответствующего согласия, а эта политика должна быть
          обновлена.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          3. Необходимые cookies
        </h2>
        <p>
          Необходимый cookie используется, чтобы выполнить запрос пользователя и
          запомнить его решение. Он не применяется для аналитики или рекламы.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          4. Stripe и внешние сайты
        </h2>
        <p>
          При выборе оплаты пользователь переходит на защищённую страницу
          Stripe. На ней Stripe может использовать собственные cookies в
          соответствии со своей политикой конфиденциальности. Cookies Stripe не
          устанавливаются этим сайтом до перехода на страницу оплаты.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          5. Изменение и отзыв согласия
        </h2>
        <p>
          Согласие можно отклонить или изменить в любое время без потери доступа
          к содержимому сайта. Отзыв действует на будущее и не влияет на
          законность обработки, выполненной до отзыва.
        </p>
        <div className="my-5 inline-flex rounded-full border border-border px-5 py-3 font-bold text-accent">
          <CookieSettingsButton />
        </div>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          6. Правовая основа
        </h2>
        <p>
          Настройки подготовлены с учётом статьи 399 польского закона Prawo
          komunikacji elektronicznej и требований GDPR к добровольному,
          конкретному, информированному и однозначному согласию.
        </p>
        <p>
          Информация об администраторе данных, целях обработки и правах
          пользователя находится в{" "}
          <Link className="font-bold text-accent" href="/privacy">
            Политике конфиденциальности RODO / GDPR
          </Link>
          .
        </p>

        <p className="mt-10">
          <Link className="font-extrabold text-accent" href="/">
            ← Вернуться на сайт
          </Link>
        </p>
      </article>
    </main>
  );
}
