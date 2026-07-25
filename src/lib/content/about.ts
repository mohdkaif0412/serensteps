/**
 * About-page copy, from the client's brand content document.
 *
 * The six values are the practice's own framework and they map to the arc of a
 * course of work — Safety first, Closure last — so the order is meaningful and
 * shouldn't be re-sorted.
 */

export const aboutIntro = [
  "Don't you think that we humans have a mind to think and solve our problems?",
  "Recognise and recall your ability, step by step, with Serene Step.",
  "Find your beat, and be in flow.",
] as const;

export const ourStory = [
  "Hey — I'm Serene Step, here to help you move forward with clarity, confidence, and balance, and to navigate life's challenges by offering guidance and evidence-based support.",
  "At Serene Step, we believe that healing and growth are processes that take time, trust, care, and deep involvement of emotion. Whether you are seeking direction in your career, harmony in your relationships, or peace within yourself, we are here to walk alongside you — step by step.",
  "Our unprocessed emotions, beliefs, and traumas are still operating and controlling our lives. We need to address them — to look at them, admit they are there, and work through them — in order to clear them.",
] as const;

export type Value = {
  title: string;
  /** The client's own shorthand for the value. */
  keywords: string;
  /** A sentence of plain-language explanation. */
  text: string;
};

export const values: Value[] = [
  {
    title: "Safety",
    keywords: "Confidentiality, trust, and respect",
    text: "Nothing else can happen until you feel safe. What you share stays between us, and you set the pace.",
  },
  {
    title: "Connection",
    keywords: "Empathy, active listening, and genuineness",
    text: "You'll meet a real person, not a script — someone listening closely and responding honestly.",
  },
  {
    title: "Understanding",
    keywords: "Assessment without judgment",
    text: "We take time to understand what's actually happening for you, without labelling or rushing to conclusions.",
  },
  {
    title: "Collaboration",
    keywords: "Shared goals and treatment planning",
    text: "We decide together what we're working towards. It's your life, so it's your plan — we bring the map, not the destination.",
  },
  {
    title: "Growth",
    keywords: "Evidence-based interventions, skill-building, and empowerment",
    text: "Real change needs more than insight. You leave with skills you can use, drawn from approaches that are known to work.",
  },
  {
    title: "Closure",
    keywords: "Summary, feedback, and agreed next steps",
    text: "Endings matter. We close well — looking back at what shifted, and being clear about what comes next.",
  },
];
