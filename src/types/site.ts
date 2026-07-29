import type { CurrencyCode } from "@/types/plan";

export type PublicAnchorId = "top" | "inside" | "plans" | "faq";

export type PublicAnchorHref = `#${PublicAnchorId}`;

export interface NavigationLink {
  label: string;
  href: PublicAnchorHref;
}

export interface ExternalContactLink {
  label: string;
  type: "email";
}

export interface SiteMetadataContent {
  title: string;
  description: string;
}

export interface BrandContent {
  mark: string;
  name: string;
  href: "#top";
}

export interface HeaderContent {
  brand: BrandContent;
  navigation: readonly NavigationLink[];
  cta: NavigationLink;
}

export type LegalDocumentId = "offer" | "privacy";

export interface FooterLegalTrigger {
  documentId: LegalDocumentId;
  label: string;
}

export interface FooterContent {
  title: string;
  description: string;
  legalTriggers: readonly FooterLegalTrigger[];
  contact: ExternalContactLink;
}

export interface StickyPurchaseBarContent {
  price: {
    prefix: string;
    price: number;
    oldPrice: number;
    currency: CurrencyCode;
  };
  cta: NavigationLink;
}

export interface PublicAnchorIds {
  top: "top";
  inside: "inside";
  plans: "plans";
  faq: "faq";
}

export interface SiteConfiguration {
  metadata: SiteMetadataContent;
  header: HeaderContent;
  footer: FooterContent;
  stickyPurchaseBar: StickyPurchaseBarContent;
  anchors: PublicAnchorIds;
  currency: CurrencyCode;
  launchNote: string;
}
