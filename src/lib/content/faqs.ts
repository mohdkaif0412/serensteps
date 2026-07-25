export type Faq = {
  question: string;
  answer: string;
  category: string;
  order: number;
};

/**
 * Static FAQ content for Phase 2. In Phase 4 this is replaced by the database
 * (same shape), so the UI that consumes it won't need to change.
 */
export const faqs: Faq[] = [
  // Getting started
  {
    category: "Getting started",
    order: 1,
    question: "I've never been to therapy before. What happens first?",
    answer:
      "Taking the first step is often the hardest part, and there's no wrong way to begin. You'll start with a gentle first session where we simply get to know each other — what's bringing you here, what you're hoping for, and any questions you have. There's no pressure to share more than you're ready to.",
  },
  {
    category: "Getting started",
    order: 2,
    question: "How do I know if therapy is right for me?",
    answer:
      "You don't need to be in crisis to benefit from support. Whether you're navigating a heavy season, feeling stuck, or simply want to understand yourself better, therapy can help. If you're unsure, a first session is a low-pressure way to find out whether it feels like the right fit.",
  },
  {
    category: "Getting started",
    order: 3,
    question: "Do you work with children and teenagers?",
    answer:
      "Yes. We offer a calm, judgment-free space for young people, and we work closely with parents and carers where it's helpful. Our approach with children and teens is warm, age-appropriate, and always at their own pace.",
  },

  // Sessions & approach
  {
    category: "Sessions & approach",
    order: 1,
    question: "How long are sessions, and how often will we meet?",
    answer:
      "Sessions are typically 50 minutes. Many people begin weekly, then adjust the rhythm as they go. There's no fixed number of sessions — we'll regularly check in on what's working and move at a pace that feels right for you.",
  },
  {
    category: "Sessions & approach",
    order: 2,
    question: "What kind of approach do you use?",
    answer:
      "We draw on evidence-based approaches and tailor them to you rather than fitting you into a method. The heart of our work is a trusting, collaborative relationship — a place to look honestly at what's there, make sense of it, and gently work it through.",
  },
  {
    category: "Sessions & approach",
    order: 3,
    question: "Do you offer online or in-person sessions?",
    answer:
      "Both. Some people feel most comfortable meeting in person; others prefer the ease of meeting online from home. We're happy to work whichever way suits you, and you can switch if your needs change.",
  },

  // Booking & payment
  {
    category: "Booking & payment",
    order: 1,
    question: "How do I book a session?",
    answer:
      "You can book directly through the Book Now button, or send us a message through the contact page and we'll help you find a time. If you're not sure where to start, just reach out — we'll guide you.",
  },
  {
    category: "Booking & payment",
    order: 2,
    question: "What if I need to cancel or reschedule?",
    answer:
      "Life happens. We simply ask for as much notice as you can give so the time can be offered to someone else. You can reschedule easily through your booking confirmation, or by getting in touch.",
  },

  // Astrology & tarot
  {
    category: "Astrology & tarot",
    order: 1,
    question: "Do I have to use astrology or tarot?",
    answer:
      "Not at all. Counselling is the foundation of everything we do, and it stands entirely on its own. Astrology and tarot are optional extras, offered only to people who find them personally meaningful — if they're not for you, simply say so and they'll never come up.",
  },
  {
    category: "Astrology & tarot",
    order: 2,
    question: "Will you predict my future?",
    answer:
      "No. We don't tell you what your future will be, and astrology and tarot are never used to predict it. They're used as reflective tools — prompts for thinking about patterns, values, hopes, and fears — always alongside evidence-based psychological support, never instead of it.",
  },
  {
    category: "Astrology & tarot",
    order: 3,
    question: "How does a reflective session actually work?",
    answer:
      "It's a conversation. A birth chart or a spread of cards gives us something to think with, and we connect what it raises to psychological ideas — attachment, emotional regulation, coping patterns, decision-making. You leave with clearer questions and practical direction, not a forecast.",
  },

  // Privacy & confidentiality
  {
    category: "Privacy & confidentiality",
    order: 1,
    question: "Is what I share kept private?",
    answer:
      "Yes. What you share in sessions is confidential. We'll always explain the rare, specific circumstances where confidentiality may be limited (for example, where there's a serious risk of harm) so you know exactly where you stand from the start.",
  },
  {
    category: "Privacy & confidentiality",
    order: 2,
    question: "How is my personal information handled?",
    answer:
      "Your information is stored securely and only used to provide your care. We never share your details for marketing, and you can ask us about what we hold at any time. You can read more on our privacy page.",
  },
];

/** Preserve first-seen category order, then sort items within each by `order`. */
export function groupFaqsByCategory(items: Faq[]) {
  const groups: { category: string; items: Faq[] }[] = [];
  for (const faq of items) {
    let group = groups.find((g) => g.category === faq.category);
    if (!group) {
      group = { category: faq.category, items: [] };
      groups.push(group);
    }
    group.items.push(faq);
  }
  for (const group of groups) group.items.sort((a, b) => a.order - b.order);
  return groups;
}
