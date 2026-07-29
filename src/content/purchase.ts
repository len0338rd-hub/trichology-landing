import type {
  PaymentDetailDefinition,
  PurchaseDialogContent,
} from "@/types/purchase";

export const paymentDetailDefinitions = [
  {
    id: "account",
    label: "Карта / счёт",
    envKey: "NEXT_PUBLIC_PAYMENT_ACCOUNT",
  },
  {
    id: "recipient",
    label: "Получатель",
    envKey: "NEXT_PUBLIC_PAYMENT_RECIPIENT",
  },
  {
    id: "purpose",
    label: "Назначение платежа",
    envKey: "NEXT_PUBLIC_PAYMENT_PURPOSE",
  },
] as const satisfies readonly PaymentDetailDefinition[];

export const purchaseDialogContent = {
  closeButtonText: "×",
  closeButtonAriaLabel: "Закрыть окно покупки",
  eyebrow: "Выбранный формат",
  priceLabel: "Стоимость:",
  paymentTitle: "Оплата по реквизитам",
  copyLabel: "Копировать",
  copiedLabel: "Скопировано",
  copyErrorLabel: "Не удалось скопировать",
  missingValueLabel: "Не указано",
  copyFeedbackDurationMs: 1200,
  deliveryFallbackText: "После оплаты отправьте чек.",
  deliveryText:
    "После оплаты отправьте чек. Гайд придёт на указанную почту или в Telegram.",
  telegramCtaLabel: "Отправить чек в Telegram",
  emailCtaLabel: "Отправить по email",
  emailSubject: "Оплата обучения по эстетической трихологии",
  stripeCtaLabel: "Оплатить через Stripe",
  stripeLoadingLabel: "Переходим к оплате…",
  stripeUnavailableLabel: "Stripe скоро будет доступен",
  stripeConsentRequiredLabel: "Сначала подтвердите немедленную выдачу PDF",
  stripeErrorMessage:
    "Не удалось открыть безопасную страницу оплаты. Попробуйте ещё раз или выберите оплату по реквизитам.",
  fallbackPlanId: "guide",
  messageTemplate: {
    greeting: "Здравствуйте! Я оплатила формат",
    formatOpening: "«",
    formatClosing: "»",
    priceSeparator: "за",
    closing: ". Отправляю чек.",
  },
} as const satisfies PurchaseDialogContent;
