import type { LegalDialogContent, LegalDocument } from "@/types/legal";
import type { LegalDocumentId } from "@/types/site";

export const legalDocuments = {
  offer: {
    id: "offer",
    triggerLabel: "Публичная оферта",
    title: "Публичная оферта и условия продажи",
    blocks: [
      {
        type: "paragraph",
        text: "Состав продукта зависит от выбранного формата и может включать PDF-гайд, доступ к AI-ассистенту в Telegram и личное сопровождение по внедрению. PDF предоставляется для личного использования. Копирование, перепродажа и передача материалов третьим лицам запрещены.",
      },
      {
        type: "seller-details",
        prefix: "Продавец: ",
        suffix: ". Цена и порядок оплаты указаны на сайте.",
      },
    ],
  },
  privacy: {
    id: "privacy",
    triggerLabel: "Конфиденциальность",
    title: "Политика конфиденциальности RODO / GDPR",
    blocks: [
      {
        type: "paragraph",
        text: "Полная информация об обработке персональных данных, правовых основаниях и правах пользователя опубликована на странице /privacy.",
      },
      {
        type: "privacy-contact",
        prefix: "Контакт для вопросов: ",
        suffix: ".",
      },
    ],
  },
} as const satisfies Record<LegalDocumentId, LegalDocument>;

export const legalDialogContent = {
  closeButtonText: "×",
} as const satisfies LegalDialogContent;
