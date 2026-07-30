import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/contact",
    "/cookies",
    "/offer",
    "/privacy",
    "/purchase-policy",
  ].map((pathname) => ({
    url: new URL(pathname, env.siteUrl).toString(),
  }));
}
