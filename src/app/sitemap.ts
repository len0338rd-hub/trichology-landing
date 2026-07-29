import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/cookies", "/purchase-policy"].map((pathname) => ({
    url: new URL(pathname, env.siteUrl).toString(),
  }));
}
