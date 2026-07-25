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
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-forest">{title}</h1>
        {description && (
          <p className="mt-1 max-w-xl text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
