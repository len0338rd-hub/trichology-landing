import { createPurchaseMessage } from "@/lib/purchase-message";
import type { PurchaseMessageInput } from "@/types/purchase";

interface TelegramPurchaseUrlInput extends PurchaseMessageInput {
  telegramUsername?: string;
}

interface EmailPurchaseUrlInput extends PurchaseMessageInput {
  contactEmail?: string;
  subject: string;
}

export function createTelegramPurchaseUrl({
  telegramUsername,
  ...messageInput
}: TelegramPurchaseUrlInput): string | null {
  const username = telegramUsername?.trim().replace(/^@+/, "");

  if (!username) {
    return null;
  }

  const message = createPurchaseMessage(messageInput);

  return `https://t.me/${encodeURIComponent(username)}?text=${encodeURIComponent(message)}`;
}

export function createEmailPurchaseUrl({
  contactEmail,
  subject,
  ...messageInput
}: EmailPurchaseUrlInput): string | null {
  const email = contactEmail?.trim();

  if (!email) {
    return null;
  }

  const message = createPurchaseMessage(messageInput);

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
