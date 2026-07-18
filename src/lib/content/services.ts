import { img, type SiteImage } from "@/lib/images";

export type Service = {
  slug: "children-teens" | "individuals" | "couples-families";
  title: string;
  /** Short audience label for chips/nav. */
  audience: string;
  intro: string;
  helps: string[];
  image: SiteImage;
};

export const services: Service[] = [
  {
    slug: "children-teens",
    title: "Children & Teens",
    audience: "Children & Teens",
    intro:
      "The growing-up years can feel loud and lonely all at once. We offer a calm, judgment-free space where young people can untangle big feelings, build confidence, and feel genuinely understood — at their own pace.",
    helps: [
      "Overthinking everything",
      "Feeling anxious or overwhelmed",
      "Struggling with friendships or fitting in",
      "Low self-esteem or self-worth",
      "Constantly comparing themselves to others",
      "Unsure of who they are or where they're headed",
      "Pressure to be perfect",
      "Feeling numb, sad, or stuck",
      "Difficulty setting boundaries",
      "Social anxiety or fear of being judged",
      "School burnout or lack of motivation",
      "Not feeling understood by parents or peers",
    ],
    image: img.teens,
  },
  {
    slug: "individuals",
    title: "Individuals",
    audience: "Individuals",
    intro:
      "Whatever you're carrying, you don't have to carry it alone. Together we'll gently explore what's weighing on you, make sense of it, and find steadier ground — one honest conversation at a time.",
    helps: [
      "Anxiety, overthinking, and constant worry",
      "People-pleasing and difficulty setting boundaries",
      "Perfectionism, burnout, and feeling never good enough",
      "Feeling stuck, lost, or emotionally numb",
      "Low self-worth and a harsh inner critic",
      "Trauma, triggers, or emotional flashbacks",
      "Guilt, shame, or unresolved past experiences",
      "Trouble trusting others or forming close relationships",
      "Grief or navigating life after a major change",
      "Questioning your identity, purpose, or sense of self",
    ],
    image: img.individual,
  },
  {
    slug: "couples-families",
    title: "Couples & Families",
    audience: "Couples & Families",
    intro:
      "Relationships are where we're most tender and most tested. We help partners and families slow down, truly hear one another, and rebuild the closeness, trust, and safety that's been missing.",
    helps: [
      "Communication breakdowns",
      "Repeating the same fights",
      "Feeling disconnected or distant",
      "Trust issues or emotional wounds",
      "Parenting and co-parenting struggles",
      "Resentment and unresolved conflict",
      "Difficulty setting shared boundaries",
      "Stress from life transitions or caregiving",
      "Healing after betrayal",
      "Longing to feel close and understood again",
      "Past-relationship trauma showing up in the present",
      "Rebuilding intimacy and emotional safety",
    ],
    image: img.couples,
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
