import type { SiteImageAsset, SiteImageId } from "@/types/image";

export const siteImages = {
  heroConsultation: {
    id: "heroConsultation",
    src: "/images/hero-consultation.png",
    width: 1448,
    height: 1086,
    alt: "Консультация по эстетической трихологии",
    sourceFormat: "png",
    sourceSha256:
      "09cad3e3d2eda2a98cc8140913c83ce43fc41827b780efb8f906792367a8d2b8",
  },
  scalpDiagnostics: {
    id: "scalpDiagnostics",
    src: "/images/scalp-diagnostics.png",
    width: 1448,
    height: 1086,
    alt: "Диагностика кожи головы",
    sourceFormat: "png",
    sourceSha256:
      "bec183bbaa6254eaed0537799e3ebc8b094cfa0b04df2e354ff0041e0e862652",
  },
} as const satisfies Record<SiteImageId, SiteImageAsset>;
