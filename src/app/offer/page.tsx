import type { Metadata } from "next";
import Link from "next/link";

import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Публичная оферта | Эстетическая трихология",
  description:
    "Условия покупки и использования цифровых продуктов по эстетической трихологии.",
};

const missingValue = "Не настроено — заполнить до начала продаж";

export default function OfferPage() {
  const sellerName = env.sellerName ?? env.paymentRecipient ?? missingValue;
  const sellerAddress = env.sellerAddress ?? missingValue;
  const sellerTaxId = env.sellerTaxId ?? missingValue;
  const contactEmail = env.contactEmail;

  return (
    <main className="min-h-dvh bg-background px-4 py-12 text-foreground sm:py-16">
      <article className="mx-auto max-w-[900px] rounded-3xl bg-white p-7 shadow-[0_22px_55px_rgba(63,43,32,0.12)] sm:p-12">
        <p className="mb-3 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">
          Условия продажи цифровых продуктов
        </p>
        <h1 className="mt-0 mb-6 font-serif text-[42px] leading-[1.08] font-medium max-[620px]:text-[34px]">
          Публичная оферта
        </h1>
        <p className="text-muted">Последнее обновление: 30 июля 2026 года.</p>

        <div className="my-7 rounded-2xl border border-border bg-soft p-5">
          <p className="mt-0 mb-3 font-extrabold">Продавец</p>
          <dl className="m-0 grid grid-cols-[minmax(150px,auto)_1fr] gap-x-5 gap-y-2 text-sm max-[620px]:grid-cols-1 max-[620px]:gap-y-1">
            <dt className="font-bold">Название</dt>
            <dd className="m-0">{sellerName}</dd>
            <dt className="font-bold">Адрес</dt>
            <dd className="m-0">{sellerAddress}</dd>
            <dt className="font-bold">NIP</dt>
            <dd className="m-0">{sellerTaxId}</dd>
            <dt className="font-bold">KRS / REGON</dt>
            <dd className="m-0">0001224953 / 544048149</dd>
            <dt className="font-bold">Уставный капитал</dt>
            <dd className="m-0">5 000 PLN</dd>
            <dt className="font-bold">Email</dt>
            <dd className="m-0">
              {contactEmail ? (
                <a
                  className="font-bold text-accent"
                  href={"mailto:" + contactEmail}
                >
                  {contactEmail}
                </a>
              ) : (
                missingValue
              )}
            </dd>
          </dl>
        </div>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          1. Общие положения
        </h2>
        <p>
          Настоящие условия определяют правила заключения и исполнения договора
          о предоставлении цифрового контента и цифровых услуг через этот сайт.
          Покупателем может быть потребитель или иное лицо, оформляющее заказ.
          Обязательные права потребителя, предусмотренные польским
          законодательством, не ограничиваются этой офертой.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          2. Продукты и объём услуги
        </h2>
        <p>
          Точное содержание выбранного пакета, его цена и срок доступа указаны
          на странице заказа до оплаты. В пакет могут входить PDF‑материалы,
          доступ к AI‑ассистенту и информационное сопровождение. Материалы носят
          образовательный характер и не заменяют диагноз, лечение или личную
          консультацию врача.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          3. Технические требования
        </h2>
        <p>
          Для использования продукта нужны устройство с доступом в интернет,
          актуальный браузер, программа для чтения PDF и действующий email. Для
          функций, предоставляемых через Telegram, необходим аккаунт Telegram.
          Покупатель отвечает за правильность контактных данных в заказе.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          4. Заказ, договор и оплата
        </h2>
        <ol className="grid list-decimal gap-2 pl-5">
          <li>Покупатель выбирает пакет и проверяет итоговую цену.</li>
          <li>
            До оплаты покупатель принимает настоящую оферту и подтверждает, что
            ознакомился с политиками сайта.
          </li>
          <li>
            Договор считается заключённым после подтверждения оплаты. Его
            содержание и подтверждения покупателя направляются на указанный
            email либо сохраняются иным доступным способом.
          </li>
          <li>
            Доступ выдаётся после успешной оплаты в срок, указанный на странице
            заказа. Если доступ не получен, покупатель должен связаться с
            продавцом через страницу контактов.
          </li>
        </ol>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          5. Немедленное предоставление PDF
        </h2>
        <p>
          Если покупатель просит предоставить PDF до истечения 14 дней, перед
          оплатой он отдельно подтверждает согласие на немедленное исполнение и
          осознание того, что после начала предоставления цифрового контента
          утратит право отказаться от договора в отношении уже предоставленного
          PDF. Отсутствие такого отдельного подтверждения не заменяется одним
          лишь принятием оферты. Права при несоответствии продукта договору и
          право подать рекламацию сохраняются.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          6. AI‑ассистент и сопровождение
        </h2>
        <p>
          Ответы AI могут содержать ошибки и должны оцениваться критически. Не
          следует отправлять AI данные о здоровье, фотографии, результаты
          анализов или сведения третьих лиц. Правила отказа от договора для
          услуг сопровождения и иных непрерывных цифровых услуг применяются
          отдельно от правил для уже выданного PDF.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          7. Лицензия и интеллектуальная собственность
        </h2>
        <p>
          Покупатель получает простую, неисключительную и непередаваемую
          лицензию на личное использование материалов в пределах срока
          выбранного пакета. Запрещены перепродажа, публичное размещение,
          передача доступа, копирование существенной части продукта и
          использование материалов для обучения сторонних систем без письменного
          согласия продавца.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          8. Отказ, возврат и рекламации
        </h2>
        <p>
          Условия 14‑дневного отказа, последствия немедленного исполнения,
          порядок возврата и рекламации подробно описаны в{" "}
          <Link className="font-bold text-accent" href="/purchase-policy">
            Политике покупки и возврата
          </Link>
          . Обращение можно направить продавцу через{" "}
          <Link className="font-bold text-accent" href="/contact">
            страницу контактов
          </Link>
          . В сообщении следует указать данные заказа, описание проблемы и
          желаемый способ решения.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          9. Персональные данные и cookies
        </h2>
        <p>
          Правила обработки данных приведены в{" "}
          <Link className="font-bold text-accent" href="/privacy">
            Политике конфиденциальности
          </Link>
          , а сведения о технологиях хранения информации — в{" "}
          <Link className="font-bold text-accent" href="/cookies">
            Политике cookies
          </Link>
          .
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          10. Ответственность и заключительные положения
        </h2>
        <p>
          Продавец отвечает за соответствие цифрового продукта договору на
          условиях польского права. Временная недоступность, вызванная
          обслуживанием или обстоятельствами вне разумного контроля продавца,
          устраняется в разумный срок. Споры стороны сначала стараются решить
          путём обращения к продавцу; потребитель также вправе использовать
          доступные в Польше внесудебные способы защиты прав. Применяется
          польское право, но это не лишает потребителя обязательной защиты,
          предоставленной применимым законом.
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
