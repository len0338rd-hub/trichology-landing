import { env } from "@/lib/env";
import {
  callTelegramApi,
  isValidTelegramWebhookSecret,
  telegramSupportConfiguration,
} from "@/lib/telegram-support";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { botToken, supportChatId, webhookSecret } =
    telegramSupportConfiguration;

  if (!botToken || !webhookSecret) {
    return new Response("Telegram support is not configured", { status: 503 });
  }

  if (
    supportChatId &&
    !isValidTelegramWebhookSecret(
      request.headers.get("x-telegram-bot-api-secret-token"),
    )
  ) {
    return new Response("Invalid setup signature", { status: 401 });
  }

  const webhookUrl = new URL("/api/telegram/support/webhook", env.siteUrl);

  if (webhookUrl.protocol !== "https:") {
    return new Response("Telegram webhook requires an HTTPS site URL", {
      status: 400,
    });
  }

  try {
    await callTelegramApi<boolean>("setWebhook", {
      url: webhookUrl.toString(),
      secret_token: webhookSecret,
      allowed_updates: ["message"],
      drop_pending_updates: false,
    });
  } catch (error) {
    console.error("Telegram webhook registration failed", error);
    return new Response("Telegram webhook registration failed", {
      status: 502,
    });
  }

  return Response.json({
    registered: true,
    webhookUrl: webhookUrl.toString(),
    supportChatConfigured: Boolean(supportChatId),
  });
}
