"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

export function CookieSettingsButton() {
  return (
    <button
      className="cursor-pointer border-0 bg-transparent p-0 text-muted transition-colors hover:text-foreground"
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))
      }
      type="button"
    >
      Настройки cookies
    </button>
  );
}
