export type SiteImageId = "heroConsultation" | "scalpDiagnostics";

export interface SiteImageAsset {
  id: SiteImageId;
  src: `/${string}`;
  width: number;
  height: number;
  alt: string;
  sourceFormat: "png";
  sourceSha256: string;
}
