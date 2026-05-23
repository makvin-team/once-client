import { Logo } from "../ui/Logo";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";

export function Footer() {
  const t = useT();
  const f = t.footer;
  return (
    <footer className="bg-footer-bg text-on-dark">
      <div className="mx-auto max-w-container px-2xl py-section">
        <div className="grid gap-section lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo variant="dark" />
            <p className="mt-md text-body-sm text-on-dark-muted max-w-[340px]">
              {f.tagline}
            </p>
            <div className="mt-md">
              <p className="text-micro-uppercase uppercase text-on-dark-muted mb-xs">
                {f.contactLabel}
              </p>
              <a
                href={`mailto:${f.contactEmail}`}
                className="text-body-md-medium text-on-primary hover:underline"
              >
                {f.contactEmail}
              </a>
            </div>
          </div>

          {f.columns.map((col) => (
            <div key={col.title}>
              <div className="text-body-md-medium text-on-dark mb-md">
                {col.title}
              </div>
              <ul className="flex flex-col gap-xxs">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => onAnchorClick(e, l.href)}
                      className="text-body-sm text-on-dark-muted hover:text-on-dark"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-section pt-xl border-t border-on-dark-muted/20 flex flex-col md:flex-row md:items-center md:justify-between gap-md">
          <p className="text-caption text-on-dark-muted">{f.copyright}</p>
          <div className="flex items-center gap-md">
            <a
              href="#"
              className="text-caption text-on-dark-muted hover:text-on-dark"
            >
              {f.privacy}
            </a>
            <span className="text-caption text-on-dark-muted">·</span>
            <span className="text-caption text-on-dark-muted">
              {t.brand.tagline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
