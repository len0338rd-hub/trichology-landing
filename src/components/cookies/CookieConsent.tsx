"use client";

import { useEffect, useState } from "react";

import { getButtonClassName } from "@/components/ui/Button";
import { cookieConsentContent } from "@/content/cookies";
import {
  defaultCookiePreferences,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookiePreferences,
  saveCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookie-consent";

type ConsentView = "hidden" | "notice" | "settings";

interface CookieCategoryProps {
  checked: boolean;
  description: string;
  disabled?: boolean;
  id: string;
  onChange?: (checked: boolean) => void;
  title: string;
}

function CookieCategory({
  checked,
  description,
  disabled = false,
  id,
  onChange,
  title,
}: CookieCategoryProps) {
  return (
    <label
      className={`flex gap-4 rounded-2xl border p-4 ${
        disabled ? "border-border bg-soft/60" : "border-border bg-white"
      }`}
      htmlFor={id}
    >
      <span className="min-w-0 flex-1">
        <strong className="block">{title}</strong>
        <span className="mt-1 block text-sm text-muted">{description}</span>
      </span>
      <input
        checked={checked}
        className="mt-1 h-5 w-5 shrink-0 accent-accent"
        disabled={disabled}
        id={id}
        onChange={(event) => onChange?.(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

export function CookieConsent() {
  const [view, setView] = useState<ConsentView>("hidden");
  const [preferences, setPreferences] = useState<CookiePreferences>(
    defaultCookiePreferences,
  );

  useEffect(() => {
    const openSettings = () => {
      setPreferences(readCookiePreferences() ?? defaultCookiePreferences);
      setView("settings");
    };
    const initializeTimer = window.setTimeout(() => {
      const storedPreferences = readCookiePreferences();

      if (storedPreferences) {
        setPreferences(storedPreferences);
      } else {
        setView("notice");
      }
    }, 0);

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);

    return () => {
      window.clearTimeout(initializeTimer);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function save(preferencesToSave: CookiePreferences) {
    saveCookiePreferences(preferencesToSave);
    setPreferences(preferencesToSave);
    setView("hidden");
  }

  if (view === "hidden") {
    return null;
  }

  return (
    <section
      aria-describedby="cookie-consent-description"
      aria-labelledby="cookie-consent-title"
      aria-modal="false"
      className="fixed right-4 bottom-4 left-4 z-[100] mx-auto max-h-[calc(100dvh-32px)] max-w-[720px] overflow-auto rounded-3xl border border-border bg-white p-6 shadow-[0_24px_70px_rgba(38,25,18,0.26)] max-[620px]:p-5"
      role="dialog"
    >
      <h2
        className="mt-0 mb-2 font-serif text-[30px] leading-tight font-medium"
        id="cookie-consent-title"
      >
        {view === "settings"
          ? cookieConsentContent.settingsTitle
          : cookieConsentContent.title}
      </h2>
      <p className="mt-0 mb-5 text-muted" id="cookie-consent-description">
        {view === "settings"
          ? cookieConsentContent.settingsDescription
          : cookieConsentContent.description}{" "}
        <a className="font-bold text-accent" href="/cookies">
          {cookieConsentContent.policyLabel}
        </a>
        .
      </p>

      {view === "settings" ? (
        <div className="mb-5 grid gap-3">
          <CookieCategory
            checked
            description={cookieConsentContent.categories.necessary.description}
            disabled
            id="cookie-necessary"
            title={cookieConsentContent.categories.necessary.title}
          />
          <CookieCategory
            checked={preferences.analytics}
            description={cookieConsentContent.categories.analytics.description}
            id="cookie-analytics"
            onChange={(analytics) =>
              setPreferences((current) => ({ ...current, analytics }))
            }
            title={cookieConsentContent.categories.analytics.title}
          />
          <CookieCategory
            checked={preferences.marketing}
            description={cookieConsentContent.categories.marketing.description}
            id="cookie-marketing"
            onChange={(marketing) =>
              setPreferences((current) => ({ ...current, marketing }))
            }
            title={cookieConsentContent.categories.marketing.title}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 max-[620px]:[&>*]:w-full">
        <button
          className={getButtonClassName({ size: "small" })}
          onClick={() => save({ analytics: true, marketing: true })}
          type="button"
        >
          {cookieConsentContent.acceptAllLabel}
        </button>
        <button
          className={getButtonClassName({ size: "small", variant: "ghost" })}
          onClick={() => save(defaultCookiePreferences)}
          type="button"
        >
          {cookieConsentContent.rejectOptionalLabel}
        </button>
        {view === "settings" ? (
          <button
            className={getButtonClassName({
              className: "max-[620px]:order-first",
              size: "small",
              variant: "ghost",
            })}
            onClick={() => save(preferences)}
            type="button"
          >
            {cookieConsentContent.saveLabel}
          </button>
        ) : (
          <button
            className={getButtonClassName({ size: "small", variant: "ghost" })}
            onClick={() => setView("settings")}
            type="button"
          >
            {cookieConsentContent.customizeLabel}
          </button>
        )}
      </div>
    </section>
  );
}
