import type { Metadata } from "next";
import Link from "next/link";

import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Политика конфиденциальности RODO / GDPR | Эстетическая трихология",
  description:
    "Информация об обработке персональных данных покупателей и пользователей сайта в соответствии с RODO / GDPR.",
};

const missingValue = "Не настроено — заполнить до начала продаж";

export default function PrivacyPolicyPage() {
  const controllerName = env.sellerName ?? env.paymentRecipient ?? missingValue;
  const controllerAddress = env.sellerAddress ?? missingValue;
  const controllerTaxId = env.sellerTaxId ?? missingValue;
  const contactEmail = env.contactEmail;

  return (
    <main className="min-h-dvh bg-background px-4 py-12 text-foreground sm:py-16">
      <article className="mx-auto max-w-[900px] rounded-3xl bg-white p-7 shadow-[0_22px_55px_rgba(63,43,32,0.12)] sm:p-12">
        <p className="mb-3 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">
          Информация по статье 13 RODO / GDPR
        </p>
        <h1 className="mt-0 mb-6 font-serif text-[42px] leading-[1.08] font-medium max-[620px]:text-[34px]">
          Политика конфиденциальности
        </h1>
        <p className="text-muted">Последнее обновление: 29 июля 2026 года.</p>

        <div className="my-7 rounded-2xl border border-border bg-soft p-5">
          <p className="mt-0 mb-3 font-extrabold">
            Администратор персональных данных
          </p>
          <dl className="m-0 grid grid-cols-[minmax(150px,auto)_1fr] gap-x-5 gap-y-2 text-sm max-[620px]:grid-cols-1 max-[620px]:gap-y-1">
            <dt className="font-bold">Имя / название</dt>
            <dd className="m-0">{controllerName}</dd>
            <dt className="font-bold">Адрес</dt>
            <dd className="m-0">{controllerAddress}</dd>
            <dt className="font-bold">NIP / идентификатор</dt>
            <dd className="m-0">{controllerTaxId}</dd>
            <dt className="font-bold">Контакт по RODO</dt>
            <dd className="m-0">
              {contactEmail ? (
                <a
                  className="font-bold text-accent"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
              ) : (
                missingValue
              )}
            </dd>
          </dl>
        </div>
        <p>
          Администратор определяет цели и способы обработки персональных данных.
          Запросы, возражения и вопросы о данных можно направлять на указанный
          выше email.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          1. Какие данные обрабатываются
        </h2>
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            имя, email, Telegram‑идентификатор, выбранный пакет, цена, дата,
            статус оплаты и подтверждения покупателя;
          </li>
          <li>
            платёжные сведения от Stripe или из банковского перевода; сайт не
            получает полный номер платёжной карты;
          </li>
          <li>
            переписка, обращения, рекламации, запросы на возврат и приложенные
            пользователем материалы;
          </li>
          <li>
            сообщения и команды, которые пользователь сам отправляет
            AI‑ассистенту, если эта функция подключена;
          </li>
          <li>
            IP‑адрес, дата и время запроса, адрес страницы, браузер, устройство
            и технические журналы безопасности;
          </li>
          <li>
            выбор cookies. Подробности приведены в{" "}
            <Link className="font-bold text-accent" href="/cookies">
              Политике cookies
            </Link>
            .
          </li>
        </ul>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          2. Цели и правовые основания
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3">Цель</th>
                <th className="p-3">Основание GDPR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border align-top">
                <td className="p-3">
                  Заказ, оплата, выдача PDF и доступа, сопровождение, возврат и
                  рекламация
                </td>
                <td className="p-3">
                  Ст. 6(1)(b) — заключение и исполнение договора
                </td>
              </tr>
              <tr className="border-b border-border align-top">
                <td className="p-3">
                  Бухгалтерский и налоговый учёт, обязанности продавца
                </td>
                <td className="p-3">
                  Ст. 6(1)(c) — выполнение юридической обязанности
                </td>
              </tr>
              <tr className="border-b border-border align-top">
                <td className="p-3">
                  Ответы на вопросы, безопасность, предотвращение
                  злоупотреблений и защита требований
                </td>
                <td className="p-3">
                  Ст. 6(1)(f) — законный интерес администратора
                </td>
              </tr>
              <tr className="border-b border-border align-top">
                <td className="p-3">
                  Необязательные cookies или маркетинг, если они будут
                  подключены и отдельно разрешены
                </td>
                <td className="p-3">
                  Ст. 6(1)(a) — согласие, которое можно отозвать
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Сейчас сайт не использует аналитические или рекламные инструменты и не
          рассылает маркетинговые сообщения. До подключения таких функций
          политика и механизм согласия должны быть обновлены.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          3. Обязательно ли предоставлять данные
        </h2>
        <p>
          Предоставление данных добровольно, но email и сведения, необходимые
          для оплаты и идентификации заказа, нужны для исполнения договора. Без
          них обработать оплату, предоставить доступ или рассмотреть обращение
          может быть невозможно. Не следует сообщать данные о здоровье или иные
          чувствительные данные, если они не нужны для конкретного обращения.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          4. Получатели данных
        </h2>
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            Stripe и участвующие платёжные организации — для платежа,
            предотвращения мошенничества и квитанций;
          </li>
          <li>
            поставщики хостинга, электронной почты, облачных и технических
            услуг;
          </li>
          <li>
            поставщик AI‑модели — после его подключения и только в объёме,
            необходимом для ответа AI‑ассистента;
          </li>
          <li>
            Telegram — только если пользователь сам выбирает этот канал и
            отправляет сообщение;
          </li>
          <li>
            бухгалтерские, юридические и IT‑подрядчики, обязанные сохранять
            конфиденциальность;
          </li>
          <li>государственные органы, когда передача требуется законом.</li>
        </ul>
        <p>
          Stripe и Telegram могут также действовать как самостоятельные
          администраторы данных:{" "}
          <a
            className="font-bold text-accent"
            href="https://stripe.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            политика Stripe
          </a>{" "}
          и{" "}
          <a
            className="font-bold text-accent"
            href="https://telegram.org/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            политика Telegram
          </a>
          .
        </p>
        <p>
          До запуска AI‑ассистента администратор должен указать фактического
          поставщика AI‑модели, проверить условия обработки и при необходимости
          обновить сведения о международной передаче. В AI‑ассистент не следует
          отправлять имена клиентов, фотографии, результаты анализов, сведения о
          здоровье или другие данные, позволяющие идентифицировать третьих лиц.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          5. Передача за пределы ЕЭЗ
        </h2>
        <p>
          Технологические поставщики могут обрабатывать данные за пределами ЕЭЗ.
          Такая передача допускается только при наличии основания по главе V
          GDPR, например решения об адекватности, стандартных договорных
          положений и необходимых дополнительных мер. Информацию о применённой
          гарантии можно запросить у администратора.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          6. Сроки хранения
        </h2>
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            данные заказа — пока они нужны для договора, обслуживания и защиты
            от требований;
          </li>
          <li>
            бухгалтерские и налоговые документы — в течение срока по польскому
            праву, как правило пять лет, считаемых по правилам соответствующего
            закона;
          </li>
          <li>
            рекламации, возвраты и споры — до завершения дела и истечения
            применимых сроков требований;
          </li>
          <li>
            переписка — до завершения обращения и затем на оправданный период
            защиты от требований;
          </li>
          <li>
            технические журналы — на необходимый для безопасности и диагностики
            период согласно настройкам хостинга;
          </li>
          <li>
            данные на основании согласия — до отзыва или прекращения цели; может
            сохраняться минимальное доказательство ранее данного согласия.
          </li>
        </ul>
        <p>
          После окончания срока данные удаляются или обезличиваются, если закон
          не требует их дальнейшего хранения.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          7. Права пользователя
        </h2>
        <p>В предусмотренных GDPR случаях пользователь вправе:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>получить доступ к данным и их копию;</li>
          <li>исправить или дополнить данные;</li>
          <li>потребовать удаления или ограничения обработки;</li>
          <li>
            получить данные в переносимом формате при обработке на основании
            согласия или договора автоматизированными средствами;
          </li>
          <li>
            возразить против обработки на основании законного интереса с учётом
            своей конкретной ситуации;
          </li>
          <li>
            отозвать согласие без влияния на законность предыдущей обработки.
          </li>
        </ul>
        <p>
          Права не являются безусловными: например, данные нельзя удалить, пока
          закон требует хранить документ. Для безопасного выполнения запроса
          администратор может попросить подтвердить личность.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          8. Жалоба в UODO
        </h2>
        <p>
          Если пользователь считает, что данные обрабатываются с нарушением
          GDPR, он вправе подать жалобу Президенту польского Urząd Ochrony
          Danych Osobowych. Контакты и способы подачи жалобы доступны на{" "}
          <a
            className="font-bold text-accent"
            href="https://uodo.gov.pl/pl/p/dla-obywatela"
            rel="noopener noreferrer"
            target="_blank"
          >
            сайте UODO
          </a>
          .
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          9. Источник данных и автоматические решения
        </h2>
        <p>
          Данные поступают от пользователя, из его переписки и от Stripe в виде
          сведений о платеже. Администратор не принимает решений, основанных
          исключительно на автоматизированной обработке и вызывающих юридические
          или сопоставимые существенные последствия, и не выполняет такое
          профилирование.
        </p>

        <h2 className="mt-9 font-serif text-2xl font-medium">
          10. Изменения политики
        </h2>
        <p>
          Политика может обновляться при изменении сайта, поставщиков или
          закона. Новая редакция публикуется здесь с новой датой. Обновление не
          создаёт нового основания для обработки уже собранных данных.
        </p>

        <p className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
          <a
            className="font-bold text-accent"
            href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
            rel="noopener noreferrer"
            target="_blank"
          >
            Текст GDPR
          </a>
          <Link className="font-bold text-accent" href="/cookies">
            Политика cookies
          </Link>
          <Link className="font-bold text-accent" href="/purchase-policy">
            Покупка и возврат
          </Link>
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
