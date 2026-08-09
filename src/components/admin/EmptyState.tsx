import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string; icon?: LucideIcon };
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-sage-deep/40 bg-sage/10 px-6 py-14 text-center sm:py-16">
      <span className="grid size-14 place-items-center rounded-full bg-sage/70 text-forest">
        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-xl text-forest">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted sm:text-base">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift"
        >
          {action.icon && <action.icon className="size-4" aria-hidden="true" />}
          {action.label}
        </Link>
      )}
    </div>
  );
}
