import type { Metadata } from "next";
import Link from "next/link";

import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Контакты | Эстетическая трихология",
  description:
    "Контактные и регистрационные данные продавца цифровых продуктов.",
};

const missingValue = "Не настроено — заполнить до начала продаж";

export default function ContactPage() {
  const sellerName = env.sellerName ?? env.paymentRecipient ?? missingValue;
  const sellerAddress = env.sellerAddress ?? missingValue;
  const sellerTaxId = env.sellerTaxId ?? missingValue;
  const contactEmail = env.contactEmail;

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-12 text-foreground sm:py-16">
      <article className="w-full max-w-[760px] rounded-3xl bg-white p-7 shadow-[0_22px_55px_rgba(63,43,32,0.12)] sm:p-12">
        <p className="mb-3 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">
          Связь с продавцом
        </p>
        <h1 className="mt-0 mb-7 font-serif text-[42px] leading-[1.08] font-medium max-[620px]:text-[34px]">
          Контакты
        </h1>

        <dl className="m-0 grid grid-cols-[minmax(150px,auto)_1fr] gap-x-6 gap-y-4 rounded-2xl border border-border bg-soft p-5 max-[620px]:grid-cols-1 max-[620px]:gap-y-2">
          <dt className="font-bold">Продавец</dt>
          <dd className="m-0">{sellerName}</dd>
          <dt className="font-bold">Адрес</dt>
          <dd className="m-0">{sellerAddress}</dd>
          <dt className="font-bold">NIP</dt>
          <dd className="m-0">{sellerTaxId}</dd>
          <dt className="font-bold">KRS</dt>
          <dd className="m-0">0001224953</dd>
          <dt className="font-bold">REGON</dt>
          <dd className="m-0">544048149</dd>
          <dt className="font-bold">Email</dt>
          <dd className="m-0">
            {contactEmail ? (
              <a
                className="font-extrabold text-accent"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </a>
            ) : (
              missingValue
            )}
          </dd>
        </dl>

        <p className="mt-6 text-muted">
          По этому адресу можно направлять вопросы о заказе, запросы на возврат,
          рекламации и обращения по RODO / GDPR.
        </p>
        <p className="mt-8">
          <Link className="font-extrabold text-accent" href="/">
            ← Вернуться на сайт
          </Link>
        </p>
      </article>
    </main>
  );
}
