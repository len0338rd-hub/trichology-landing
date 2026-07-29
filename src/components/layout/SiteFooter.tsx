import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { Container } from "@/components/ui/Container";
import { footerContent } from "@/content/site";
import { env } from "@/lib/env";

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
            <button
              className="cursor-pointer border-0 bg-transparent p-0 text-muted transition-colors hover:text-foreground"
              data-legal={trigger.documentId}
              key={trigger.documentId}
              type="button"
            >
              {trigger.label}
            </button>
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
          {env.contactEmail ? (
            <a
              className="text-muted no-underline transition-colors hover:text-foreground"
              href={`mailto:${env.contactEmail}`}
            >
              {footerContent.contact.label}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="cursor-not-allowed text-muted opacity-60"
            >
              {footerContent.contact.label}
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}
