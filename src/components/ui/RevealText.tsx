import {
  Fragment,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Per-word heading reveal — the words rise in as a wave rather than the whole
 * block fading as one plate. Editorial, and much more alive than a single fade.
 *
 * A **server** component with no JavaScript at all: the stagger is `animation-delay`
 * per word (see `.word-rise` in globals.css). That matters more than it sounds.
 * The h1 is usually the LCP element, and a JS-driven reveal keeps it invisible
 * until the bundle has downloaded and hydrated — this starts on the first paint
 * instead, so it's *faster* than the block `<Reveal>` it replaces.
 *
 * Rich headings work unchanged: the tree is walked and only string leaves are
 * split, so `<em>` accents and nested layout spans are preserved exactly.
 *
 *   <h1><RevealText>Support for every step, <em>whichever way you begin</em></RevealText></h1>
 *
 * Reduced motion is handled globally (the media query at the foot of globals.css
 * collapses every animation), so the fallback is instant, static text.
 *
 * Use above the fold. Below it, `<Reveal>` is right — a load-time CSS animation
 * would have finished long before the reader scrolled down to see it.
 */

/** Seconds added per word. Small: the wave should read as one gesture. */
const PER_WORD = 0.045;
/** Ceiling on the stagger, so a long heading never crawls in. */
const MAX_DELAY = 0.36;

function decorate(node: ReactNode, counter: { i: number }): ReactNode {
  // Whitespace is passed through verbatim so words wrap and space normally.
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((chunk, k) => {
      if (!chunk.trim()) return chunk;
      // Rounded: three decimals is finer than a frame, and keeps the HTML clean.
      const delay = Math.round(Math.min(counter.i * PER_WORD, MAX_DELAY) * 1000) / 1000;
      counter.i += 1;
      return (
        <span
          key={k}
          className="word-rise"
          style={{ "--rise-delay": `${delay}s` } as CSSProperties}
        >
          {chunk}
        </span>
      );
    });
  }

  if (Array.isArray(node)) {
    return node.map((child, k) => (
      <Fragment key={k}>{decorate(child, counter)}</Fragment>
    ));
  }

  // Keep the element (and its classes) and split what's inside it.
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    if (element.props.children === undefined) return node;
    return cloneElement(element, undefined, decorate(element.props.children, counter));
  }

  return node;
}

export function RevealText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={className}>{decorate(children, { i: 0 })}</span>;
}

/**
 * The same first-paint entrance for a whole block (an eyebrow, a paragraph, a
 * button row) rather than word by word.
 */
export function RiseIn({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Step 0–4, matching the `.rise-delay-*` classes. */
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  as?: "div" | "p" | "span" | "li";
}) {
  return (
    <Tag className={cn("rise-in", delay > 0 && `rise-delay-${delay}`, className)}>
      {children}
    </Tag>
  );
}
