import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-sage-deep/15 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
      <div>
        <h1 className="font-display text-2xl text-forest sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
