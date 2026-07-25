import { postCover } from "@/lib/images";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date string. */
  publishedAt: string;
  readingMinutes: number;
  coverAlt: string;
  /** HTML body (as Tiptap will store it in Phase 3). */
  content: string;
};

/**
 * Seed content for the journal. The database (Post model) is the live source —
 * these are upserted by slug on `npm run db:seed`, then owned by the admin:
 * editable and deletable there without ever being overwritten from here.
 */
export const posts: Post[] = [
  {
    slug: "psychology-astrology-tarot-self-reflection",
    title:
      "Psychology, Astrology & Tarot: Can they work together for self-reflection?",
    excerpt:
      "Many people are searching for more than stress relief — they're searching for meaning. Where psychology, astrology, and tarot can genuinely meet, and where they can't.",
    category: "Reflection",
    publishedAt: "2026-07-18",
    readingMinutes: 6,
    coverAlt: "Soft morning light falling across an open notebook",
    content: `
<p>In today's fast-moving world, many people are searching for more than stress relief — they're searching for meaning. Questions like <em>"Why do I keep repeating the same patterns?"</em>, <em>"Why do I feel stuck?"</em>, or <em>"What direction should I take?"</em> often lead people to explore both psychology and spiritual practices.</p>
<p>But can psychology, astrology, and tarot work together? The answer depends on how they are used.</p>
<h2>Psychology: the foundation</h2>
<p>Psychology is based on scientific research. It helps us understand how our thoughts, emotions, beliefs, and behaviours influence our mental well-being.</p>
<p>Therapies such as Cognitive Behaviour Therapy (CBT) teach practical skills to:</p>
<ul>
<li>Challenge negative thinking</li>
<li>Reduce anxiety</li>
<li>Improve emotional regulation</li>
<li>Build healthier relationships</li>
<li>Increase self-awareness</li>
</ul>
<p>Psychology focuses on helping people develop coping strategies and make informed choices.</p>
<h2>Astrology: a tool for reflection</h2>
<p>Many people find astrology meaningful because it offers a symbolic way to think about personality traits, life themes, and relationships.</p>
<p>Whether or not someone believes astrology has predictive value, discussing a birth chart can encourage reflection by prompting questions such as:</p>
<ul>
<li>What are my strengths?</li>
<li>Which habits keep repeating?</li>
<li>How do I respond to challenges?</li>
<li>What values matter most to me?</li>
</ul>
<p>These conversations can support self-awareness when approached thoughtfully, rather than as certainty.</p>
<h2>Tarot: a mirror, not a prediction</h2>
<p>Tarot cards are often misunderstood. At Serene Step, tarot is not used to predict fixed outcomes. Instead, the images and symbols on the cards act as prompts for reflection and conversation.</p>
<p>For example, a card may encourage someone to think about:</p>
<ul>
<li>Fear versus courage</li>
<li>Letting go of unhealthy patterns</li>
<li>Personal values</li>
<li>Emotional balance</li>
<li>Decision-making</li>
</ul>
<p>Rather than providing answers, tarot can help people explore questions they may not have considered.</p>
<h2>A balanced approach</h2>
<p>Imagine someone struggling with career uncertainty. A counselling session may identify self-doubt, perfectionism, or fear of failure. An optional astrology discussion might explore personality themes that resonate with the client. A tarot reflection could open a conversation about hopes, fears, and possible paths forward.</p>
<p>Together, these approaches can encourage deeper self-reflection while keeping practical decision-making grounded in psychological principles.</p>
<h2>What we believe</h2>
<p>At Serene Step, your mental health comes first.</p>
<p>Psychological counselling provides the foundation for emotional well-being. Astrology and tarot are available only for clients who find them personally meaningful and wish to use them as reflective tools — <strong>not as scientific assessments, and not as guarantees about the future.</strong></p>
<p>Every meaningful journey begins with understanding yourself. And sometimes, the first step toward healing is simply giving yourself permission to pause, reflect, and grow.</p>
<blockquote>Healing isn't about predicting tomorrow. It's about understanding yourself today.</blockquote>
`,
  },
  {
    slug: "the-first-step-into-therapy",
    title: "The first step into therapy — and why it's the hardest",
    excerpt:
      "If you've been circling the idea of therapy for a while, you're not alone. Here's what actually happens when you begin, and why the first step is the biggest one.",
    category: "Getting started",
    publishedAt: "2026-06-28",
    readingMinutes: 4,
    coverAlt: "A quiet doorway opening onto soft morning light",
    content: `
<p>If you've found your way to this page, chances are you've been thinking about reaching out for a while. Maybe for weeks. Maybe for years. That quiet, circling consideration is itself a kind of courage — and it deserves gentleness, not judgment.</p>
<p>People often imagine the first session as an exam they might fail. It isn't. There's nothing you need to prepare, no tidy story you have to tell, no right way to feel.</p>
<h2>What the first session is really like</h2>
<p>Mostly, it's a conversation. We get to know each other. You share what's bringing you here — as much or as little as feels comfortable — and we begin to understand what you're hoping for.</p>
<ul>
<li>There's no pressure to relive anything you're not ready to.</li>
<li>You can ask questions about how we work.</li>
<li>You get to notice whether it feels like the right fit.</li>
</ul>
<h2>Why the first step feels so heavy</h2>
<p>Reaching out means admitting, even just to yourself, that something matters enough to change. That's vulnerable. But naming something is also the beginning of loosening its grip.</p>
<p>Healing isn't about fixing what is broken; it's about discovering the strength that was already inside you. We're just here to help you find the way — one step at a time.</p>
`,
  },
  {
    slug: "anxiety-and-overthinking",
    title: "When your mind won't stop: gentle ways back to the present",
    excerpt:
      "Overthinking can feel like protection, but it often keeps us stuck. A few soft, practical ways to come back to the moment when worry takes the wheel.",
    category: "Anxiety",
    publishedAt: "2026-06-10",
    readingMinutes: 5,
    coverAlt: "Calm water with soft ripples catching the light",
    content: `
<p>Anxiety loves a story about the future. It replays conversations, rehearses worst cases, and convinces us that if we just think hard enough, we'll finally feel safe. But overthinking rarely delivers the certainty it promises.</p>
<h2>Notice the loop, without fighting it</h2>
<p>You don't have to win an argument with your anxious mind. Often the kindest move is simply to notice: <em>Ah, I'm in the loop again.</em> That small moment of awareness creates a little space — and space is where choice lives.</p>
<h2>Come back to your body</h2>
<p>Worry lives in the future; your body lives in the present. Gentle anchors can help you return:</p>
<ul>
<li>Feel your feet on the floor and name three things you can see.</li>
<li>Let your out-breath be a little longer than your in-breath.</li>
<li>Hold something warm and notice its weight in your hands.</li>
</ul>
<p>None of this makes the worry wrong or shameful. It simply reminds your nervous system that, right now, in this moment, you are okay.</p>
<p>If the loop feels relentless, that's worth exploring with support — not because you're failing, but because you deserve to feel steadier.</p>
`,
  },
  {
    slug: "boundaries-without-guilt",
    title: "Setting boundaries without the guilt",
    excerpt:
      "If saying 'no' leaves you feeling selfish, you're not alone. Boundaries aren't walls — they're the doorways that let real closeness in.",
    category: "Relationships",
    publishedAt: "2026-05-22",
    readingMinutes: 4,
    coverAlt: "A hand resting gently on a wooden gate",
    content: `
<p>For many people — especially those who learned early that love had to be earned — boundaries feel dangerous. Saying no can trigger a wave of guilt so strong it's easier to just say yes and quietly resent it later.</p>
<h2>A boundary is information, not rejection</h2>
<p>A boundary simply tells someone how to be close to you. "I can't talk tonight, but I'd love to tomorrow" isn't a door slammed shut — it's a door held open on honest terms.</p>
<h2>The guilt is old, not accurate</h2>
<p>That guilty feeling is often a memory, not a fact. It made sense once, in relationships where your needs weren't safe. It doesn't have to run the show now.</p>
<ul>
<li>Start small, with lower-stakes moments.</li>
<li>Keep it kind and clear — you don't owe a lengthy defense.</li>
<li>Expect the guilt to show up, and let it pass without obeying it.</li>
</ul>
<p>Boundaries aren't walls. They're the shape that lets a relationship hold real closeness — the kind that doesn't cost you yourself.</p>
`,
  },
  {
    slug: "supporting-a-teen-who-shuts-down",
    title: "Supporting a teenager who's shutting down",
    excerpt:
      "When a teen goes quiet, it's easy to feel shut out. Small, steady ways to stay connected without pushing them further away.",
    category: "Parenting",
    publishedAt: "2026-05-04",
    readingMinutes: 5,
    coverAlt: "Two mugs on a kitchen table in warm afternoon light",
    content: `
<p>When your once-chatty child starts closing their door — literally and emotionally — it can feel like grief. You want to reach them, but every question seems to push them further away.</p>
<h2>Presence over pressure</h2>
<p>Teens often open up sideways, not head-on. The car, the kitchen, a late-night snack — connection tends to arrive in low-pressure moments, not in a sit-down "let's talk."</p>
<ul>
<li>Be available without hovering.</li>
<li>Lead with curiosity, not correction.</li>
<li>Let small conversations be enough; they add up.</li>
</ul>
<h2>Their silence isn't rejection of you</h2>
<p>Shutting down is often a sign of overwhelm, not defiance. Underneath it is usually a young person working very hard to manage feelings they don't yet have words for.</p>
<p>And if things feel stuck, a calm, neutral space of their own — somewhere that's <em>theirs</em>, not yours — can help them find those words. That's often where we come in.</p>
`,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const publishedPosts = () =>
  [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );

export const withCover = (post: Post) => ({
  ...post,
  cover: postCover(post.slug),
});
