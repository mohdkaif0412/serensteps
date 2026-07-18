import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <section className="pb-4 pt-10 sm:pt-16">
      <Container size="prose">
        <Reveal className={cn(centered && "mx-auto text-center")}>
          {eyebrow && (
            <p
              className={cn(
                "mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted",
                centered && "justify-center",
              )}
            >
              <span className="size-1.5 rounded-full bg-honey" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl leading-[1.08] text-pine sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed text-muted",
                centered && "mx-auto",
              )}
            >
              {intro}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
