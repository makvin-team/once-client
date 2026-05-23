import { Badge } from "../ui/Badge";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";

export function PromoBanner() {
  const t = useT();
  const promo = t.promo;
  return (
    <a
      id="top"
      href={promo.href}
      onClick={(e) => onAnchorClick(e, promo.href)}
      className="hidden md:block bg-primary text-on-primary text-body-sm-medium px-md py-sm hover:opacity-90 transition-opacity"
    >
      <div className="mx-auto max-w-container flex items-center justify-center gap-sm flex-wrap">
        <span className="opacity-90">{promo.text}</span>
        <Badge variant="promo">{promo.badge}</Badge>
      </div>
    </a>
  );
}
