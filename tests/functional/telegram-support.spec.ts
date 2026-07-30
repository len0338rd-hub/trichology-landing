import { expect, test } from "@playwright/test";

test("Telegram webhook закрыт до добавления серверных настроек", async ({
  request,
}) => {
  const webhookResponse = await request.post("/api/telegram/support/webhook", {
    data: { update_id: 1 },
  });
  const registerResponse = await request.post("/api/telegram/support/register");

  expect(webhookResponse.status()).toBe(503);
  expect(registerResponse.status()).toBe(503);
});
