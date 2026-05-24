import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { useAuth } from "../../auth/AuthProvider";
import type { Permission } from "../../data/entities";
import { Logo } from "../ui/Logo";

export type SidebarSection = {
  title?: string;
  items: ReadonlyArray<SidebarItem>;
};

export type SidebarItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  permission?: Permission;
  badge?: number | string;
  /** Render as a plain <a> (full navigation) — for pages served outside the
   *  SPA, e.g. the reverse-proxied simulator at /learner/simulator. */
  external?: boolean;
};

type SidebarProps = {
  sections: ReadonlyArray<SidebarSection>;
  footer?: ReactNode;
  collapsed?: boolean;
  className?: string;
};

export function Sidebar({
  sections,
  footer,
  collapsed,
  className,
}: SidebarProps) {
  const { can } = useAuth();
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-canvas border-r border-hairline-soft",
        collapsed ? "w-[68px]" : "w-[260px]",
        "transition-[width] duration-200",
        className,
      )}
    >
      <div className="h-[64px] px-md flex items-center border-b border-hairline-soft">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto py-md">
        {sections.map((section, si) => {
          // Filter items down to those the current user can see. If a whole
          // section ends up empty (e.g. a Compliance Manager looking at the
          // "Content" group), skip rendering the section entirely so the
          // group title doesn't sit by itself.
          const visible = section.items.filter(
            (it) => !it.permission || can(it.permission),
          );
          if (visible.length === 0) return null;
          return (
            <div key={si} className={cn(si > 0 && "mt-md")}>
              {section.title && !collapsed && (
                <p className="px-md text-micro-uppercase uppercase text-stone mb-xs">
                  {section.title}
                </p>
              )}
              <ul className="flex flex-col gap-px px-xs">
                {visible.map((item) => {
                  const baseCls =
                    "flex items-center gap-sm px-sm py-xs rounded-md text-body-sm-medium transition-colors";
                  const inner = (
                    <>
                      <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center text-current">
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!collapsed && item.badge !== undefined && (
                        <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-brand-yellow text-primary text-caption-bold pastel">
                          {item.badge}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={`${item.to}|${item.label}`}>
                      {item.external ? (
                        <a
                          href={item.to}
                          className={cn(
                            baseCls,
                            "text-charcoal hover:bg-surface-soft hover:text-ink",
                          )}
                        >
                          {inner}
                        </a>
                      ) : (
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={({ isActive }) =>
                            cn(
                              baseCls,
                              isActive
                                ? "bg-surface text-ink"
                                : "text-charcoal hover:bg-surface-soft hover:text-ink",
                            )
                          }
                        >
                          {inner}
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {footer && (
        <div className="border-t border-hairline-soft p-md">{footer}</div>
      )}
    </aside>
  );
}
