import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { Container } from "@/components/ui/Container";
import { footerContent } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 max-[951px]:pb-[100px]">
      <Container
        className="flex justify-between gap-[30px] max-[621px]:flex-col"
        dataTestId="footer-inner"
      >
        <div>
          <strong>{footerContent.title}</strong>
          <p className="my-1.5 text-muted">{footerContent.description}</p>
        </div>
        <div className="flex flex-wrap gap-[22px]">
          {footerContent.legalTriggers.map((trigger) => (
            <a
              className="text-muted no-underline transition-colors hover:text-foreground"
              data-legal={trigger.documentId}
              href={trigger.documentId === "offer" ? "/offer" : "/privacy"}
              key={trigger.documentId}
            >
              {trigger.label}
            </a>
          ))}
          <a
            className="text-muted no-underline transition-colors hover:text-foreground"
            href="/purchase-policy"
          >
            Покупка и возврат
          </a>
          <a
            className="text-muted no-underline transition-colors hover:text-foreground"
            href="/cookies"
          >
            Политика cookies
          </a>
          <CookieSettingsButton />
          <a
            className="text-muted no-underline transition-colors hover:text-foreground"
            href="/contact"
          >
            {footerContent.contact.label}
          </a>
        </div>
      </Container>
    </footer>
  );
}
