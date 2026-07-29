export const COOKIE_CONSENT_NAME = "et_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";
export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";

export interface CookiePreferences {
  readonly analytics: boolean;
  readonly marketing: boolean;
}

interface StoredCookieConsent extends CookiePreferences {
  readonly version: number;
  readonly savedAt: string;
}

export const defaultCookiePreferences: CookiePreferences = Object.freeze({
  analytics: false,
  marketing: false,
});

function getCookieValue(name: string): string | undefined {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));

  return cookie ? cookie.slice(prefix.length) : undefined;
}

export function readCookiePreferences(): CookiePreferences | undefined {
  const rawValue = getCookieValue(COOKIE_CONSENT_NAME);

  if (!rawValue) {
    return undefined;
  }

  try {
    const stored = JSON.parse(
      decodeURIComponent(rawValue),
    ) as Partial<StoredCookieConsent>;

    if (
      stored.version !== COOKIE_CONSENT_VERSION ||
      typeof stored.analytics !== "boolean" ||
      typeof stored.marketing !== "boolean"
    ) {
      return undefined;
    }

    return {
      analytics: stored.analytics,
      marketing: stored.marketing,
    };
  } catch {
    return undefined;
  }
}

function removeKnownOptionalCookies(preferences: CookiePreferences) {
  const optionalPrefixes = [
    ...(preferences.analytics ? [] : ["_ga", "_gid", "_gat"]),
    ...(preferences.marketing ? [] : ["_fbp", "_fbc"]),
  ];

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();

    if (name && optionalPrefixes.some((prefix) => name.startsWith(prefix))) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
}

export function saveCookiePreferences(preferences: CookiePreferences) {
  const stored: StoredCookieConsent = {
    ...preferences,
    version: COOKIE_CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  };
  const secureAttribute =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(
    JSON.stringify(stored),
  )}; Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureAttribute}`;

  removeKnownOptionalCookies(preferences);
  window.dispatchEvent(
    new CustomEvent<CookiePreferences>(COOKIE_CONSENT_UPDATED_EVENT, {
      detail: preferences,
    }),
  );
}
