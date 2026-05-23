import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";
import { Icon } from "./icons";
import { useT } from "../../i18n";

type StubPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

// Placeholder used for pages that are scaffolded into the navigation but
// whose UI hasn't been built yet. Keeps the structure clear so reviewers
// see exactly what's covered.
export function StubPage({ eyebrow, title, description }: StubPageProps) {
  const t = useT();
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        tone="soft"
        icon={<Icon.Bolt />}
        title={t.app.common.comingSoon}
        description={t.app.common.comingSoonBody}
      />
    </div>
  );
}
