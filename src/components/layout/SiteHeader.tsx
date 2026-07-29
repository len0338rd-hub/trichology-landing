import { headerContent } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function SiteHeader() {
  return (
    <>
      <a
        className="fixed top-2 left-2 z-50 -translate-y-24 rounded-full bg-accent px-4 py-2 font-bold text-white transition-transform focus:translate-y-0"
        href="#top"
      >
        Перейти к основному содержимому
      </a>
      <header
        className="sticky top-0 z-20 border-b border-[rgba(141,106,86,0.14)] bg-[rgba(250,246,242,0.9)] py-2.5 backdrop-blur-[18px]"
        data-testid="site-header"
      >
        <Container className="flex max-w-[1180px] items-center justify-between max-[621px]:w-[calc(100%_-_28px)]">
          <a
            className="flex items-center gap-3 font-extrabold no-underline"
            href={headerContent.brand.href}
          >
            <span className="grid size-[38px] place-items-center rounded-full bg-accent font-serif text-white">
              {headerContent.brand.mark}
            </span>
            <span className="max-[621px]:hidden" data-testid="brand-name">
              {headerContent.brand.name}
            </span>
          </a>
          <nav
            aria-label="Основная навигация"
            className="flex items-center gap-6 max-[951px]:hidden"
            data-testid="header-nav"
          >
            {headerContent.navigation.map((link) => (
              <a
                className="text-sm leading-[1.5] text-muted no-underline transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
            <Button href={headerContent.cta.href} size="small">
              {headerContent.cta.label}
            </Button>
          </nav>
        </Container>
      </header>
    </>
  );
}
