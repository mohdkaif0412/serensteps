import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey disabled:opacity-60 disabled:pointer-events-none cursor-pointer";

const variants: Record<Variant, string> = {
  // Deep, grounding green — the workhorse dark CTA
  primary: "bg-pine text-paper hover:bg-pine/90 shadow-soft hover:shadow-lift",
  // Warm accent — hope. Use sparingly (hero, final CTA).
  accent: "bg-honey text-pine hover:brightness-[1.04] shadow-soft hover:shadow-lift",
  outline: "border border-sage-deep/60 text-pine hover:border-pine hover:bg-sage/50",
  ghost: "text-pine hover:bg-sage/60",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm sm:text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
};

type ButtonProps = BaseProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseProps
  >;

const isExternal = (href: string) =>
  /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={classes}
          target={anchorProps.target ?? "_blank"}
          rel={anchorProps.rel ?? "noopener noreferrer"}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
