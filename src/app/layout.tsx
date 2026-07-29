import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { siteMetadata } from "@/content/site";
import { env } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: env.siteUrl,
  title: siteMetadata.title,
  description: siteMetadata.description,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
