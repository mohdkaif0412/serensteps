"use client";

import { useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Calls a server action (delete / toggle) for a given row id, with an optional
 * confirm dialog and success toast. Used for the destructive/quick actions in
 * the admin list tables.
 */
export function ActionButton({
  action,
  id,
  confirm,
  toastMessage,
  title,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirm?: string;
  toastMessage?: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        const formData = new FormData();
        formData.set("id", id);
        startTransition(async () => {
          await action(formData);
          if (toastMessage) toast.success(toastMessage);
        });
      }}
      className={cn(className, pending && "pointer-events-none opacity-50")}
    >
      {children}
    </button>
  );
}
