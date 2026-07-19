import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// Warm hover-lift + a satisfying press (settles back down and in slightly).
const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey disabled:opacity-60 disabled:pointer-events-none cursor-pointer active:translate-y-0 active:scale-[0.985] active:shadow-soft";

const variants: Record<Variant, string> = {
  // Deep, grounding green — the workhorse dark CTA
  primary:
    "bg-pine text-paper shadow-soft hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lift",
  // Warm honey — hope. Reserved for the key CTA moments (hero, final band).
  accent:
    "bg-honey text-pine shadow-soft hover:-translate-y-0.5 hover:shadow-lift hover:brightness-[1.05]",
  outline:
    "border border-sage-deep/60 text-pine hover:-translate-y-0.5 hover:border-pine hover:bg-sage-mist",
  ghost: "text-pine hover:bg-sage/60",
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
