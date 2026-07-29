import type { LegalDocumentId } from "@/types/site";

export interface LegalParagraph {
  type: "paragraph";
  text: string;
}

export interface LegalList {
  type: "list";
  items: readonly string[];
}

export interface SellerDetailsBlock {
  type: "seller-details";
  prefix: string;
  suffix: string;
}

export interface PrivacyContactBlock {
  type: "privacy-contact";
  prefix: string;
  suffix: string;
}

export type LegalBlock =
  LegalParagraph | LegalList | SellerDetailsBlock | PrivacyContactBlock;

export interface LegalDocument {
  id: LegalDocumentId;
  triggerLabel: string;
  title: string;
  warning?: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDialogContent {
  closeButtonText: string;
}
