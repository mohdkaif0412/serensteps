import { cn } from "@/lib/utils";

type Tone = "mint" | "sage" | "muted";

const tones: Record<Tone, string> = {
  mint: "bg-mint/20 text-forest",
  sage: "bg-sage text-forest",
  muted: "bg-sage-mist text-muted",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
