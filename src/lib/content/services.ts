import { img, type SiteImage } from "@/lib/images";

/**
 * The practice offers two distinct things, and the Services page tabs between
 * them: evidence-based counselling & testing, and optional reflective guidance
 * through astrology & tarot.
 *
 * Copy here is the client's own, from the brand content document — normalised
 * for capitalisation and typos only. Keep it that way: it's their voice, and the
 * astrology/tarot framing in particular is deliberate and shouldn't be loosened.
 */

/* ── Tab 1: Counselling & Testing ─────────────────────────────────── */

/** A named cluster of concrete sub-services under "What we help with". */
export type SubServiceGroup = {
  title: string;
  items: string[];
};

export type Service = {
  slug: "children-teens" | "individuals" | "couples-families";
  title: string;
  /** Short audience label for chips/nav. */
  audience: string;
  intro: string;
  /** What people arrive carrying. */
  concerns: string[];
  /** The work itself, grouped. */
  helps: SubServiceGroup[];
  /** A closing reassurance in the practice's voice. */
  closing: string;
  image: SiteImage;
};

export const services: Service[] = [
  {
    slug: "children-teens",
    title: "Children & Teens",
    audience: "Children & Teens",
    intro:
      "We support children and adolescents in building emotional resilience, confidence, and healthy relationships, while helping them navigate the challenges of growing up. We provide a safe, compassionate, and non-judgmental space where young people can express themselves, understand their emotions, and develop practical coping skills.",
    concerns: [
      "Overthinking everything",
      "Feeling anxious or overwhelmed",
      "Struggling with friendships or fitting in",
      "Low self-esteem or self-worth",
      "Comparing themselves to others constantly",
      "Unsure of who they are or where they're headed",
      "Constant pressure to be perfect",
      "Feeling numb, sad, or stuck",
      "Difficulty setting boundaries",
      "Social anxiety or fear of being judged",
      "School burnout or lack of motivation",
      "Not feeling understood by parents or peers",
    ],
    helps: [
      {
        title: "Early childhood assessment",
        items: [
          "Developmental screening",
          "Observational assessment",
          "Portfolio assessment",
          "Developmental assessment",
        ],
      },
      {
        title: "Career planning assessment & tests",
        items: [
          "Psychometric test",
          "Career report",
          "Personalised roadmap",
          "1:1 counselling session",
        ],
      },
      {
        title: "Child & adolescent counselling",
        items: [
          "Mental health",
          "Behaviour",
          "Life changes",
          "Social skills",
          "Social support",
        ],
      },
    ],
    closing:
      "We believe every child and adolescent deserves to feel heard, valued, and empowered. By working collaboratively with young people and their families, we help them develop the emotional, social, and personal skills they need to flourish both in school and in life.",
    image: img.teens,
  },
  {
    slug: "individuals",
    title: "Individual",
    audience: "Individuals",
    intro:
      "Life can be overwhelming, and you don't have to face it alone. We provide a safe, confidential, and supportive space where adults can explore their thoughts, emotions, and life experiences without judgment. Together, we work to understand the root of your concerns, develop healthy coping strategies, and build resilience for lasting emotional well-being.",
    concerns: [
      "Anxiety, overthinking, and constant worry",
      "People-pleasing and difficulty setting boundaries",
      "Perfectionism, burnout, and feeling never good enough",
      "Feeling stuck, lost, or emotionally numb",
      "Low self-worth and a harsh inner critic",
      "Struggling with trauma, triggers, or emotional flashbacks",
      "Guilt, shame, or unresolved past experiences",
      "Trouble trusting others or forming close relationships",
      "Grieving a loss or navigating life after major change",
      "Questioning your identity, purpose, or sense of self",
    ],
    helps: [
      {
        title: "What we help with",
        items: [
          "Stress and anxiety",
          "Depression and sadness",
          "Grief and loss",
          "Relationship problems",
          "Life changes and transitions",
        ],
      },
    ],
    closing:
      "Our counselling sessions are tailored to your unique needs, using evidence-based psychological approaches to help you gain clarity, strengthen emotional well-being, improve relationships, and create meaningful, lasting change.",
    image: img.individual,
  },
  {
    slug: "couples-families",
    title: "Couples & Family",
    audience: "Couples & Families",
    intro:
      "Strong relationships are built on trust, understanding, and meaningful communication — but every family and couple experiences challenges along the way. We provide a safe, compassionate, and non-judgmental space where couples and families can work through conflicts, strengthen emotional connections, and build healthier relationships. Whether you're facing communication difficulties, recurring conflicts, parenting challenges, major life transitions, or the impact of past emotional wounds, our goal is to help every family member feel heard, respected, and supported.",
    concerns: [
      "Communication breakdowns",
      "Repeating the same fights",
      "Feeling disconnected or distant",
      "Trust issues or emotional wounds",
      "Struggles with parenting and co-parenting",
      "Resentment and unresolved conflict",
      "Difficulty setting shared boundaries",
      "Stress from life transitions or caregiving",
      "Navigating healing after betrayal",
      "Longing to feel close and understood again",
      "Trauma from past relationships showing up in the present",
      "Wanting to rebuild intimacy and emotional safety",
    ],
    helps: [
      {
        title: "What we help with",
        items: [
          "Couple counselling",
          "Relationship management",
          "Major life transitions",
        ],
      },
    ],
    closing:
      "We believe that healthier relationships create happier families. By working together, we help couples and families strengthen their bonds, resolve conflicts with empathy, and build a home where every member feels valued, understood, and connected.",
    image: img.couples,
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

/* ── Tab 2: Astrology & Tarot ─────────────────────────────────────── */

export const reflectiveIntro = {
  heading: "Reflective Guidance Through a Unique Integrative Approach",
  body: [
    "At Serene Step, astrology and tarot are not used to predict or control your future. Instead, they are used as reflective tools that help you explore patterns, emotions, relationships, strengths, fears, and life decisions alongside evidence-based psychological understanding.",
    "By combining psychology, astrology, and tarot, we help clients gain deeper self-awareness, emotional clarity, and practical direction for personal growth.",
  ],
} as const;

export type AstrologyService = {
  slug: string;
  title: string;
  /** "What it explores" */
  explores: string[];
  /** "Psychology Collaboration" */
  collaboration: string;
  /** "Outcome" */
  outcome: string;
};

export const astrologyServices: AstrologyService[] = [
  {
    slug: "birth-chart-analysis",
    title: "Birth Chart Analysis",
    explores: [
      "Personality traits and emotional patterns",
      "Communication style and relationships",
      "Strengths, challenges, and inner motivations",
      "Areas of personal growth and self-development",
    ],
    collaboration:
      "We connect chart themes with psychological concepts such as self-esteem, attachment style, emotional regulation, coping patterns, and identity development. This helps clients understand why they respond to situations in certain ways, and how they can develop healthier behaviours.",
    outcome:
      "Greater self-awareness, confidence, and understanding of personal strengths and emotional needs.",
  },
  {
    slug: "year-ahead-transit-reading",
    title: "Year-Ahead Transit Reading",
    explores: [
      "Major themes for the coming year",
      "Career, relationships, health, and personal growth periods",
      "Times of change, transition, and reflection",
      "Opportunities for learning and development",
    ],
    collaboration:
      "Instead of viewing transits as fixed events, we use them to discuss goal setting, stress management, resilience building, decision-making, and emotional preparation for upcoming life changes.",
    outcome:
      "A practical and emotionally grounded roadmap for navigating the year ahead.",
  },
  {
    slug: "relationship-chart-reading",
    title: "Relationship Chart Reading",
    explores: [
      "Relationship dynamics and compatibility",
      "Communication patterns",
      "Emotional needs and expectations",
      "Areas of harmony and potential conflict",
    ],
    collaboration:
      "We integrate relationship psychology, attachment theory, conflict resolution, and communication skills to help couples understand each other more deeply and build healthier connections.",
    outcome:
      "Better communication, emotional understanding, and relationship awareness.",
  },
];

export type TarotService = {
  slug: string;
  title: string;
  focus: string;
  integration: string;
};

export const tarotIntro =
  "Tarot at Serene Step is used as a guided reflection tool to explore thoughts, emotions, and life situations.";

export const tarotServices: TarotService[] = [
  {
    slug: "love-relationships",
    title: "Love & Relationships",
    focus:
      "Emotional patterns, communication, boundaries, and relationship expectations.",
    integration:
      "Exploring attachment needs, trust issues, people-pleasing tendencies, and emotional safety in relationships.",
  },
  {
    slug: "health-wellness",
    title: "Health & Wellness",
    focus: "Emotional well-being, stress levels, self-care, and balance.",
    integration:
      "Identifying stress triggers, burnout patterns, emotional exhaustion, and healthy coping strategies.",
  },
  {
    slug: "career-finances",
    title: "Career & Finances",
    focus: "Career direction, confidence, opportunities, and decision-making.",
    integration:
      "Addressing self-doubt, fear of failure, motivation, perfectionism, and career-related anxiety.",
  },
  {
    slug: "spiritual-growth",
    title: "Spiritual Growth",
    focus: "Inner reflection, personal values, meaning, and life purpose.",
    integration:
      "Encouraging mindfulness, self-reflection, emotional awareness, and personal development.",
  },
  {
    slug: "life-guidance",
    title: "Life Guidance",
    focus: "Current challenges, crossroads, and future direction.",
    integration:
      "Helping clients explore options, clarify priorities, and make thoughtful decisions aligned with their values.",
  },
];

export const whatWeBelieve = {
  eyebrow: "What we believe",
  body: "We believe every person carries a unique story. Sometimes you need evidence-based psychological support, and sometimes you need a different perspective that helps you reflect on your life. We offer a thoughtful blend of professional counselling, psychological techniques, and optional reflective guidance through astrology and tarot to help you gain clarity, confidence, and emotional balance.",
} as const;

/**
 * The terms that frame the astrology & tarot offering. These are load-bearing,
 * not boilerplate — they must stay visible on the page, not tucked into a
 * footer or an accordion.
 */
export const reflectiveTerms = [
  "At Serene Step, astrology and tarot are never used as substitutes for mental health treatment, or as tools to predict the future. When clients choose them, they are used as reflective conversations that complement professional counselling.",
  "We don't tell you what your future will be.",
  "We help you understand yourself, strengthen your resilience, and make decisions with greater awareness.",
  "Because the most powerful answers often come from within — you simply need the right guidance to discover them.",
] as const;
