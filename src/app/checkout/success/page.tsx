import Link from "next/link";

import { plans } from "@/content/plans";
import { DIGITAL_DELIVERY_CONSENT_TEXT } from "@/lib/digital-delivery-consent";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string | string[] }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: rawSessionId } = await searchParams;
  const sessionId = typeof rawSessionId === "string" ? rawSessionId : "";
  const stripe = getStripeClient();
  let isPaid = false;
  let planName = "выбранный формат";
  let consentAcceptedAt = "";

  if (stripe && sessionId.startsWith("cs_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      isPaid = session.payment_status === "paid";
      planName =
        plans.find((plan) => plan.id === session.metadata?.planId)?.name ??
        planName;
      consentAcceptedAt =
        session.metadata?.digitalDeliveryConsent === "accepted"
          ? (session.metadata.digitalDeliveryConsentAcceptedAt ?? "")
          : "";
    } catch {
      isPaid = false;
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-soft px-4 py-10">
      <section className="w-full max-w-[620px] rounded-3xl bg-white p-8 text-center shadow-[0_24px_70px_rgba(38,25,18,0.16)] max-[620px]:p-6">
        <p className="mb-4 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">
          {isPaid ? "Оплата подтверждена" : "Проверяем оплату"}
        </p>
        <h1 className="mt-0 mb-4 font-serif text-[42px] leading-[1.08] font-medium max-[620px]:text-[34px]">
          {isPaid ? "Спасибо за покупку!" : "Платёж обрабатывается"}
        </h1>
        <p className="mx-auto mb-7 max-w-[480px] text-muted">
          {isPaid
            ? `Stripe подтвердил оплату за «${planName}». Сохраните квитанцию: информация о доступе будет отправлена отдельно на email, указанный при оплате.`
            : "Если вы уже завершили оплату, подтверждение может занять немного времени. Проверьте email с квитанцией Stripe."}
        </p>
        {isPaid && consentAcceptedAt ? (
          <div className="mx-auto mb-7 max-w-[520px] rounded-2xl border border-border bg-soft p-5 text-left text-sm leading-relaxed">
            <p className="mt-0 mb-2 font-extrabold">
              Согласие на немедленную выдачу зафиксировано
            </p>
            <p className="mt-0 mb-2">{DIGITAL_DELIVERY_CONSENT_TEXT}</p>
            <p className="m-0 text-muted">
              Время:{" "}
              {new Date(consentAcceptedAt).toLocaleString("ru-RU", {
                timeZone: "Europe/Warsaw",
                timeZoneName: "short",
              })}
            </p>
          </div>
        ) : null}
        <Link className="font-extrabold text-accent" href="/">
          Вернуться на сайт
        </Link>
      </section>
    </main>
  );
}
