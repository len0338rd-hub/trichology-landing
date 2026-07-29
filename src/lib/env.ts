const LOCAL_SITE_URL = "http://localhost:3000";

interface PublicEnvironment {
  readonly siteUrl: URL;
  readonly telegramUsername?: string;
  readonly contactEmail?: string;
  readonly sellerName?: string;
  readonly sellerAddress?: string;
  readonly sellerTaxId?: string;
  readonly paymentRecipient?: string;
  readonly paymentAccount?: string;
  readonly paymentPurpose?: string;
}

function readOptionalValue(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function normalizeSiteUrl(value: string | undefined): URL {
  const fallback = new URL(LOCAL_SITE_URL);
  const normalizedValue = readOptionalValue(value);

  if (!normalizedValue) {
    return fallback;
  }

  try {
    const url = new URL(normalizedValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return fallback;
    }

    return new URL(url.origin);
  } catch {
    return fallback;
  }
}

export const env: PublicEnvironment = Object.freeze({
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  telegramUsername: readOptionalValue(
    process.env.NEXT_PUBLIC_TELEGRAM_USERNAME,
  ),
  contactEmail: readOptionalValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  sellerName: readOptionalValue(process.env.NEXT_PUBLIC_SELLER_NAME),
  sellerAddress: readOptionalValue(process.env.NEXT_PUBLIC_SELLER_ADDRESS),
  sellerTaxId: readOptionalValue(process.env.NEXT_PUBLIC_SELLER_TAX_ID),
  paymentRecipient: readOptionalValue(
    process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT,
  ),
  paymentAccount: readOptionalValue(process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT),
  paymentPurpose: readOptionalValue(process.env.NEXT_PUBLIC_PAYMENT_PURPOSE),
});
