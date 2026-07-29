export type FaqId =
  "medical" | "barber" | "delivery" | "ai-assistant" | "premium" | "printing";

export interface FaqItem {
  id: FaqId;
  question: string;
  answer: string;
}
