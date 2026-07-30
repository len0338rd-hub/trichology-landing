import "server-only";

import { timingSafeEqual } from "node:crypto";

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
  caption?: string;
  reply_to_message?: TelegramMessage;
  photo?: unknown[];
  document?: unknown;
  video?: unknown;
  voice?: unknown;
  audio?: unknown;
  sticker?: unknown;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

function readOptionalValue(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function readChatId(value: string | undefined): string | undefined {
  const normalizedValue = readOptionalValue(value);

  return normalizedValue && /^-?\d+$/.test(normalizedValue)
    ? normalizedValue
    : undefined;
}

const botToken = readOptionalValue(process.env.TELEGRAM_BOT_TOKEN);
const webhookSecret = readOptionalValue(process.env.TELEGRAM_WEBHOOK_SECRET);
const supportChatId = readChatId(process.env.TELEGRAM_SUPPORT_CHAT_ID);

export const telegramSupportConfiguration = Object.freeze({
  botToken,
  webhookSecret,
  supportChatId,
});

export function isValidTelegramWebhookSecret(
  providedSecret: string | null,
): boolean {
  if (!webhookSecret || !providedSecret) {
    return false;
  }

  const expected = Buffer.from(webhookSecret);
  const provided = Buffer.from(providedSecret);

  return (
    expected.length === provided.length && timingSafeEqual(expected, provided)
  );
}

export async function callTelegramApi<T>(
  method: string,
  payload: Record<string, unknown>,
): Promise<T> {
  if (!botToken) {
    throw new Error("Telegram bot token is not configured");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );
  const body = (await response.json().catch(() => undefined)) as
    TelegramApiResponse<T> | undefined;

  if (!response.ok || !body?.ok || body.result === undefined) {
    throw new Error(
      `Telegram ${method} failed (${response.status}): ${
        body?.description ?? "unknown error"
      }`,
    );
  }

  return body.result;
}

function commandFrom(message: TelegramMessage): string | undefined {
  const firstWord = message.text?.trim().split(/\s+/, 1)[0];

  return firstWord?.toLowerCase().split("@", 1)[0];
}

function senderName(user: TelegramUser | undefined): string {
  if (!user) {
    return "Имя не указано";
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return user.username ? `${fullName} (@${user.username})` : fullName;
}

function attachmentLabel(message: TelegramMessage): string {
  if (message.photo) return "[Фотография]";
  if (message.document) return "[Документ]";
  if (message.video) return "[Видео]";
  if (message.voice) return "[Голосовое сообщение]";
  if (message.audio) return "[Аудиофайл]";
  if (message.sticker) return "[Стикер]";

  return "[Сообщение без текста]";
}

function requestMarker(chatId: number): string {
  return `[support-user:${chatId}]`;
}

function replyTarget(message: TelegramMessage): string | undefined {
  const repliedText = message.reply_to_message?.text;
  const match = repliedText?.match(/^\[support-user:(-?\d+)\]/);

  return match?.[1];
}

async function sendMessage(
  chatId: number | string,
  text: string,
  extra: Record<string, unknown> = {},
) {
  return callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    ...extra,
  });
}

async function handleSupportReply(message: TelegramMessage) {
  const targetChatId = replyTarget(message);

  if (!targetChatId) {
    await sendMessage(
      message.chat.id,
      "Чтобы ответить клиенту, нажмите «Ответить» именно на карточке его обращения.",
    );
    return;
  }

  await callTelegramApi("copyMessage", {
    chat_id: targetChatId,
    from_chat_id: message.chat.id,
    message_id: message.message_id,
  });
  await sendMessage(message.chat.id, "✅ Ответ отправлен клиенту.", {
    reply_parameters: { message_id: message.message_id },
  });
}

async function handleCustomerMessage(message: TelegramMessage) {
  if (!supportChatId) {
    await sendMessage(
      message.chat.id,
      "Техническая поддержка сейчас настраивается. Пожалуйста, воспользуйтесь email на странице контактов.",
    );
    return;
  }

  const content = (message.text ?? message.caption ?? attachmentLabel(message))
    .trim()
    .slice(0, 3000);
  const supportCard = [
    requestMarker(message.chat.id),
    "Новое обращение в техподдержку",
    `От: ${senderName(message.from)}`,
    `Chat ID: ${message.chat.id}`,
    "",
    content,
    "",
    "Чтобы ответить клиенту, ответьте на эту карточку.",
  ].join("\n");

  await sendMessage(supportChatId, supportCard);

  if (!message.text) {
    await callTelegramApi("copyMessage", {
      chat_id: supportChatId,
      from_chat_id: message.chat.id,
      message_id: message.message_id,
    });
  }

  await sendMessage(
    message.chat.id,
    "Спасибо! Сообщение передано в техподдержку. Ответ придёт сюда. Не отправляйте медицинские документы и чувствительные данные.",
  );
}

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const message = update.message;

  if (!message || message.from?.is_bot) {
    return;
  }

  const command = commandFrom(message);

  if (command === "/myid") {
    await sendMessage(
      message.chat.id,
      `Ваш Telegram Chat ID: ${message.chat.id}`,
    );
    return;
  }

  if (command === "/start") {
    await sendMessage(
      message.chat.id,
      "Здравствуйте! Опишите вопрос или проблему одним сообщением. Техподдержка ответит вам здесь. Не отправляйте медицинские документы и другие чувствительные данные.",
    );
    return;
  }

  if (supportChatId && String(message.chat.id) === supportChatId) {
    await handleSupportReply(message);
    return;
  }

  await handleCustomerMessage(message);
}
