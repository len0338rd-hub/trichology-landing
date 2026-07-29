export const DIGITAL_DELIVERY_CONSENT_VERSION = "2026-07-29-v1";

export const DIGITAL_DELIVERY_CONSENT_TEXT =
  "Прошу предоставить PDF‑гайд сразу, до истечения 14 дней, и даю явное согласие на начало исполнения договора. Подтверждаю, что понимаю: после предоставления доступа к PDF‑гайду я утрачу право отказаться от договора в отношении этого цифрового контента. Права на рекламацию сохраняются.";

export const DIGITAL_DELIVERY_CONSENT_SCOPE = "pdf-guide";

export interface DigitalDeliveryConsentInput {
  accepted?: unknown;
  version?: unknown;
}

export function isValidDigitalDeliveryConsent(
  value: unknown,
): value is { accepted: true; version: string } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const consent = value as DigitalDeliveryConsentInput;

  return (
    consent.accepted === true &&
    consent.version === DIGITAL_DELIVERY_CONSENT_VERSION
  );
}
