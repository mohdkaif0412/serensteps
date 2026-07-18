import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Narrower measure for reading-heavy content (letters, prose). */
  size?: "default" | "prose" | "wide";
};

const widths = {
  default: "max-w-6xl",
  prose: "max-w-3xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  as: Tag = "div",
  className,
  children,
  size = "default",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8", widths[size], className)}>
      {children}
    </Tag>
  );
}
