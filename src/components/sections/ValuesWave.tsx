import { Reveal } from "@/components/ui/Reveal";
import { values } from "@/lib/content/about";
import { cn } from "@/lib/utils";

/* The wave lives in a fixed-width centre gutter. Each row draws its own
   half-period, stretched to that row's height, so the crests always land on
   their node no matter how much text a value carries. Chained together the
   segments read as one continuous sine — the logo's wave, stood upright. */
const GUTTER = 96;
const CENTRE = GUTTER / 2;
const CREST = 24; // distance from centre to a crest

/** Bulges left on even rows, right on odd — one half-period, top to bottom. */
function waveSegment(bulgeLeft: boolean) {
  const x = bulgeLeft ? CENTRE - CREST : CENTRE + CREST;
  const lead = bulgeLeft ? CENTRE - CREST * 0.75 : CENTRE + CREST * 0.75;
  return `M${CENTRE} 0 C${lead} 12, ${x} 30, ${x} 50 C${x} 70, ${lead} 88, ${CENTRE} 100`;
}

/**
 * The six values as a designed sequence rather than a list: a wave threading
 * down the page with a value resting on every crest, alternating side to side.
 * It's the logo's motif doing real work — the values *are* the journey, in order,
 * from Safety through to Closure.
 *
 * Below `lg` the wave straightens into a numbered spine, because a serpentine
 * needs two columns to read as one.
 */
export function ValuesWave() {
  return (
    <ol className="relative mt-10">
      {values.map((value, i) => {
        const bulgeLeft = i % 2 === 0;
        return (
          <li
            key={value.title}
            className="relative grid gap-y-3 pb-9 pl-14 last:pb-0 lg:grid-cols-2 lg:gap-x-28 lg:pb-4 lg:pl-0"
          >
            {/* ── Desktop: the wave segment for this row ── */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block"
              style={{ width: GUTTER }}
            >
              <svg
                viewBox={`0 0 ${GUTTER} 100`}
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path
                  d={waveSegment(bulgeLeft)}
                  fill="none"
                  stroke="var(--color-sage-deep)"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* ── Mobile: a straight spine instead ── */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-4 top-9 w-px bg-sage-deep/40 lg:hidden"
            />

            {/* The node: on the crest at desktop, on the spine at mobile */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-4 top-0 z-10 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-mint-deep/40 bg-paper font-display text-sm text-mint-deep shadow-soft",
                "lg:top-1/2 lg:-translate-y-1/2",
                bulgeLeft ? "lg:left-[calc(50%-24px)]" : "lg:left-[calc(50%+24px)]",
              )}
            >
              {i + 1}
            </span>

            <Reveal
              delay={i * 0.04}
              className={cn(
                "lg:py-7",
                bulgeLeft
                  ? "lg:col-start-1 lg:pr-4 lg:text-right"
                  : "lg:col-start-2 lg:pl-4",
              )}
            >
              <h3 className="font-display text-2xl leading-tight text-forest">
                {value.title}
              </h3>
              <p className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-mint-deep">
                {value.keywords}
              </p>
              <p className="mt-2.5 max-w-[46ch] leading-[1.75] text-muted lg:inline-block">
                {value.text}
              </p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
