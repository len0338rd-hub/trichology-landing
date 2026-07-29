import { purchaseDialogContent } from "@/content/purchase";
import type { PurchaseMessageInput } from "@/types/purchase";

export function createPurchaseMessage({
  planName,
  price,
  currency,
  digitalDeliveryConsentText,
}: PurchaseMessageInput): string {
  const template = purchaseDialogContent.messageTemplate;
  const purchaseLine = `${template.greeting} ${template.formatOpening}${planName}${template.formatClosing} ${template.priceSeparator} ${price} ${currency}${template.closing}`;

  return digitalDeliveryConsentText
    ? `${purchaseLine}\n\nМоё согласие на немедленную выдачу:\n${digitalDeliveryConsentText}`
    : purchaseLine;
}
