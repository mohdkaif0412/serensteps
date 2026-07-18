"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/** Fires a one-time success toast when a `?flash=` message is present. */
export function Flash({ message }: { message?: string }) {
  const shown = useRef(false);
  useEffect(() => {
    if (message && !shown.current) {
      shown.current = true;
      toast.success(message);
    }
  }, [message]);
  return null;
}
