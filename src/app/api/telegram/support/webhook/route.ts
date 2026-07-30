import {
  handleTelegramUpdate,
  isValidTelegramWebhookSecret,
  telegramSupportConfiguration,
  type TelegramUpdate,
} from "@/lib/telegram-support";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (
    !telegramSupportConfiguration.botToken ||
    !telegramSupportConfiguration.webhookSecret
  ) {
    return new Response("Telegram support is not configured", { status: 503 });
  }

  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token");

  if (!isValidTelegramWebhookSecret(providedSecret)) {
    return new Response("Invalid Telegram webhook signature", { status: 401 });
  }

  const update = (await request.json().catch(() => undefined)) as
    TelegramUpdate | undefined;

  if (
    !update ||
    typeof update.update_id !== "number" ||
    (update.message && typeof update.message.message_id !== "number")
  ) {
    return new Response("Invalid Telegram update", { status: 400 });
  }

  try {
    await handleTelegramUpdate(update);
  } catch (error) {
    console.error("Telegram support update failed", error);
    return new Response("Telegram support processing failed", { status: 500 });
  }

  return Response.json({ received: true });
}
