import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// Warm hover-lift + a satisfying press (settles back down and in slightly).
// Warm hover-lift + a satisfying press (settles back down and in slightly).
// The focus ring is deliberately NOT set here — the global `:focus-visible`
// rule owns it, so it can flip to pure mint inside `.on-forest` bands.
const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-soft disabled:opacity-60 disabled:pointer-events-none cursor-pointer active:translate-y-0 active:scale-[0.985] active:shadow-soft";

const variants: Record<Variant, string> = {
  // Deep, grounding green — the workhorse dark CTA
  primary:
    "bg-forest text-paper shadow-soft hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lift",
  // Brand mint — a large fill, so pure mint is right here (forest-on-mint 4.7:1).
  accent:
    "bg-mint text-forest shadow-soft hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.05]",
  outline:
    "border border-sage-deep/60 text-forest hover:-translate-y-0.5 hover:border-forest hover:bg-sage-mist",
  ghost: "text-forest hover:bg-sage/60",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm sm:text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-5 py-2.5",
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
