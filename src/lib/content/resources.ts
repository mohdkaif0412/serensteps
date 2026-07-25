/**
 * The /resources glossary — plain-language answers to the questions people
 * actually type before they book.
 *
 * Every entry is written answer-first: `short` is a single self-contained
 * sentence that stands on its own if it's quoted out of context (which is
 * exactly what search snippets and answer engines do), and `detail` fills in the
 * nuance underneath. Entries link on to the service or page that follows from
 * them, so each cluster feeds the site rather than dead-ending.
 *
 * Editorial rules for anything added here:
 *   · General information, never diagnosis or treatment advice.
 *   · No promises about outcomes.
 *   · Keep the astrology/tarot framing exactly as the practice states it —
 *     reflective, optional, never predictive, never a substitute for care.
 */

export type GlossaryEntry = {
  /** Anchor + DefinedTerm id. Stable: it's a public URL fragment. */
  slug: string;
  term: string;
  /** One sentence. The definition, complete on its own. */
  short: string;
  /** The nuance. One or two short paragraphs. */
  detail: string[];
  /** Where to go next. Keeps the cluster linked into the site. */
  related?: { label: string; href: string }[];
};

export type GlossaryCluster = {
  slug: string;
  title: string;
  /** Why someone would be reading this cluster. */
  intro: string;
  entries: GlossaryEntry[];
};

export const resourcesIntro =
  "Therapy has a lot of words in it, and almost none of them are explained before you need them. This is a plain-language guide to the ones that come up most — what they mean, what they don't, and what they look like in an actual session.";

export const resourcesNote =
  "These are general explanations to help you feel oriented, not a diagnosis and not treatment advice. Nothing here replaces a conversation with a professional who knows your situation.";

export const glossary: GlossaryCluster[] = [
  {
    slug: "starting-therapy",
    title: "Starting therapy",
    intro:
      "The questions almost everyone has before a first session, and nobody feels quite able to ask.",
    entries: [
      {
        slug: "what-is-counselling",
        term: "Counselling",
        short:
          "Counselling is a series of confidential conversations with a trained professional, aimed at understanding what you're carrying and building practical ways to work with it.",
        detail: [
          "It isn't advice-giving, and it isn't someone telling you what your life should look like. Most of the work is making sense of patterns — what sets a feeling off, what you do next, what that costs you — and then building skills that give you more choice the next time.",
          "You don't need to be in crisis to benefit. People come while navigating a heavy season, a decision, a relationship, a loss, or simply a sense of being stuck.",
        ],
        related: [
          { label: "Individual counselling", href: "/services#individuals" },
          { label: "Book a first session", href: "/contact" },
        ],
      },
      {
        slug: "counselling-vs-psychotherapy",
        term: "Counselling vs. psychotherapy",
        short:
          "The two words are used almost interchangeably; in practice counselling tends to focus on a current difficulty, while psychotherapy tends to go further back into long-standing patterns.",
        detail: [
          "The distinction is softer than the labels suggest, and good work usually moves between the two. What matters far more than the name is the fit between you and the person you're working with, and whether the approach suits what you're bringing.",
        ],
        related: [{ label: "Our approach", href: "/about" }],
      },
      {
        slug: "first-session",
        term: "The first session",
        short:
          "A first session is a getting-to-know-each-other conversation: what brings you here, what you're hoping for, and any questions you have — with no obligation to share more than you're ready to.",
        detail: [
          "Expect to do less of the deep work and more of the orientation. Together you'll get a sense of what's happening for you, what you'd like to be different, and whether working together feels right.",
          "It's normal to leave a first session feeling both lighter and tired. Nothing has to be resolved in it.",
        ],
        related: [{ label: "What to expect", href: "/contact" }],
      },
      {
        slug: "confidentiality",
        term: "Confidentiality",
        short:
          "Confidentiality means what you share in a session stays between you and your therapist, apart from a few specific situations — chiefly a serious risk of harm — which are explained to you at the start.",
        detail: [
          "The limits are named up front rather than discovered later, so you always know where you stand before you decide what to share. Notes and personal details are stored securely and used only to provide your care.",
        ],
        related: [
          { label: "Privacy & confidentiality FAQs", href: "/faq" },
          { label: "How we handle your data", href: "/privacy" },
        ],
      },
      {
        slug: "how-long-therapy-takes",
        term: "How long therapy takes",
        short:
          "There's no fixed number of sessions: many people start weekly, then adjust the rhythm as things shift, with the pace reviewed together as you go.",
        detail: [
          "Some concerns settle in a handful of focused sessions. Longer-standing patterns — trauma, identity, repeated relationship difficulties — usually take longer, because they were built over years.",
          "Endings are part of the work rather than an afterthought: looking back at what changed, and being clear about what comes next.",
        ],
        related: [{ label: "Closure, our sixth value", href: "/about" }],
      },
    ],
  },
  {
    slug: "anxiety-and-overwhelm",
    title: "Anxiety & overwhelm",
    intro:
      "The vocabulary of a mind that won't switch off — and what each of these words actually points at.",
    entries: [
      {
        slug: "anxiety",
        term: "Anxiety",
        short:
          "Anxiety is the body and mind preparing for a threat — useful when there is one, exhausting when the alarm won't switch off.",
        detail: [
          "It shows up in the body (a tight chest, shallow breathing, a stomach that won't settle), in thinking (worst-case scenarios, an urge to plan for everything), and in behaviour (avoiding, over-preparing, checking).",
          "Work on anxiety is rarely about arguing with the thoughts. It's more often about learning what the alarm is responding to, letting the body come down first, and slowly widening what feels approachable.",
        ],
        related: [
          { label: "Individual counselling", href: "/services#individuals" },
        ],
      },
      {
        slug: "overthinking",
        term: "Overthinking (rumination)",
        short:
          "Overthinking is repeatedly turning the same thought over without arriving anywhere — thinking that feels like problem-solving but doesn't produce a decision.",
        detail: [
          "The tell is the absence of movement: an hour of thought and nothing has been decided, only rehearsed. It often carries a hidden hope that enough thinking will make certainty appear.",
          "Sessions tend to focus less on the content of the loop and more on how you relate to it — noticing it earlier, and finding a way back out that doesn't require the thought to be resolved first.",
        ],
      },
      {
        slug: "panic-attack",
        term: "Panic attack",
        short:
          "A panic attack is a sudden surge of intense fear with strong physical symptoms — a racing heart, breathlessness, dizziness — that peaks within minutes and passes.",
        detail: [
          "The physical intensity is what makes it frightening: it can genuinely feel like something is medically wrong. It isn't dangerous in itself, though it deserves proper support, and it's worth ruling out physical causes with a doctor.",
          "If you're having panic attacks, or you're frightened of the next one, that's a good reason to reach out rather than to wait and see.",
        ],
        related: [{ label: "Get in touch", href: "/contact" }],
      },
      {
        slug: "burnout",
        term: "Burnout",
        short:
          "Burnout is the exhaustion, detachment and drop in capability that follows a long stretch of demand without enough recovery.",
        detail: [
          "It isn't the same as being tired, and it isn't fixed by a weekend. The distinctive part is the flattening — work or study that used to matter starts to feel far away, and effort stops producing results.",
          "Recovery involves both the load and the relationship to it: what can actually be put down, what boundaries are missing, and what the drive to keep going is protecting you from feeling.",
        ],
        related: [
          { label: "Individual counselling", href: "/services#individuals" },
        ],
      },
      {
        slug: "emotional-regulation",
        term: "Emotional regulation",
        short:
          "Emotional regulation is the ability to feel something strongly without either being swept away by it or having to shut it down.",
        detail: [
          "It's a set of learnable skills, not a personality trait — and it's much harder when you're tired, hungry, or already carrying a heavy week.",
          "Most people arrive good at one end and not the other: either flooded, or numb. Widening the range in both directions is a large part of what therapy builds.",
        ],
      },
      {
        slug: "grounding",
        term: "Grounding",
        short:
          "Grounding is any technique that brings your attention back into the present moment and into your body when you're overwhelmed or dissociating.",
        detail: [
          "Naming five things you can see, feeling your feet on the floor, holding something cold — the specific technique matters far less than practising it before you need it.",
          "It isn't a cure for anxiety. It's the thing that makes the rest of the work possible, by bringing you back into a state where thinking is available again.",
        ],
      },
    ],
  },
  {
    slug: "relationships-and-boundaries",
    title: "Relationships & boundaries",
    intro:
      "How connection goes wrong in predictable ways — and the words for the patterns underneath.",
    entries: [
      {
        slug: "boundaries",
        term: "Boundaries",
        short:
          "A boundary is a clear statement of what you will and won't do — it describes your own limits, rather than trying to control someone else's behaviour.",
        detail: [
          "That distinction is what makes a boundary hold. “I won't discuss this when we're shouting” is a boundary; “you need to stop shouting” is a request, and it depends on the other person's cooperation.",
          "The hard part is almost never knowing what your limits are. It's tolerating the guilt that arrives when you finally state one.",
        ],
        related: [
          { label: "Couples & family counselling", href: "/services#couples-families" },
        ],
      },
      {
        slug: "people-pleasing",
        term: "People-pleasing",
        short:
          "People-pleasing is prioritising other people's comfort over your own needs so consistently that you lose track of what you actually want.",
        detail: [
          "It usually began as something intelligent — a way to stay safe or keep the peace in a setting where that mattered. The cost shows up later as resentment, exhaustion, and relationships in which nobody knows you very well.",
          "Work here tends to move slowly and deliberately, because the guilt is real and worth taking seriously rather than overriding.",
        ],
      },
      {
        slug: "attachment-style",
        term: "Attachment style",
        short:
          "Attachment style describes the pattern you learned early on for seeking closeness and handling separation — and it tends to show up most under stress.",
        detail: [
          "It's a description, not a diagnosis or a fixed label, and it says more about what you learned than about who you are. Two people's patterns can also amplify each other: one moves closer under threat, the other needs space, and both read the other as the problem.",
          "In couples work, naming the pattern often lowers the temperature more than resolving any single argument does.",
        ],
        related: [
          { label: "Relationship chart reading", href: "/services#relationship-chart-reading" },
          { label: "Couples & family counselling", href: "/services#couples-families" },
        ],
      },
      {
        slug: "couples-counselling",
        term: "Couples counselling",
        short:
          "Couples counselling is joint work on the relationship itself — communication, recurring conflict, trust, and connection — with both people in the room.",
        detail: [
          "The relationship is the client, which means the aim isn't to establish who was right. It's to make the pattern visible to both of you, and to build ways of returning to each other after a rupture.",
          "It helps with rebuilding after betrayal, with parenting and co-parenting friction, with long-running distance, and with the slow drift that follows a major life change.",
        ],
        related: [
          { label: "Couples & family counselling", href: "/services#couples-families" },
          { label: "Book a session", href: "/contact" },
        ],
      },
      {
        slug: "emotional-safety",
        term: "Emotional safety",
        short:
          "Emotional safety is the felt sense that you can be honest — including about difficult things — without being punished, mocked, or abandoned for it.",
        detail: [
          "It's the precondition for everything else, in a relationship and in a therapy room alike. Without it, people manage the conversation instead of having it.",
          "It's built out of small, repeated, unremarkable moments of being met, which is why it takes time and why it can be rebuilt.",
        ],
        related: [{ label: "Safety, our first value", href: "/about" }],
      },
    ],
  },
  {
    slug: "children-teens-and-school",
    title: "Children, teens & school",
    intro:
      "What the assessment words mean, and what support looks like for a young person.",
    entries: [
      {
        slug: "child-adolescent-counselling",
        term: "Child & adolescent counselling",
        short:
          "Child and adolescent counselling is age-appropriate therapeutic support for a young person, usually alongside their parents or carers where that helps.",
        detail: [
          "With younger children the work often happens through play, drawing and story rather than sitting and talking. With teenagers it looks closer to adult counselling, with more care taken over privacy and pace.",
          "Parents are generally kept involved in the shape of the work — goals, patterns, what helps at home — while the detail of what a young person shares stays theirs.",
        ],
        related: [
          { label: "Children & teens", href: "/services#children-teens" },
        ],
      },
      {
        slug: "developmental-screening",
        term: "Developmental screening",
        short:
          "Developmental screening is a short, structured check of whether a young child's communication, movement, play and social skills are developing as expected for their age.",
        detail: [
          "It's a first look rather than a diagnosis: the point is to notice early whether anything needs a fuller assessment, because early support is consistently more effective than late support.",
          "Nothing about a screening is a verdict on a child. Most screenings are reassuring.",
        ],
        related: [
          { label: "Early childhood assessment", href: "/services#children-teens" },
        ],
      },
      {
        slug: "psychometric-test",
        term: "Psychometric test",
        short:
          "A psychometric test is a standardised questionnaire or task that measures something specific — aptitude, interests, personality traits — against how a large comparison group responded.",
        detail: [
          "Standardisation is what makes the result meaningful, and also what limits it: a test measures the narrow thing it was built to measure, on the day you took it. It doesn't summarise a person.",
          "Used well, a test is a conversation-starter for a career or study decision, read alongside the person's own account of themselves — never a label handed down.",
        ],
        related: [
          { label: "Career planning assessment", href: "/services#children-teens" },
        ],
      },
      {
        slug: "career-counselling",
        term: "Career counselling",
        short:
          "Career counselling combines assessment with conversation to build a realistic, personal roadmap for study or work — not just a list of suggested jobs.",
        detail: [
          "A useful process covers aptitude and interests, but also the pressures around the decision: family expectations, fear of choosing wrong, and the anxiety of committing to anything at all.",
          "The output is a direction you can actually walk, plus a way of making the next decision when circumstances change.",
        ],
        related: [
          { label: "Career planning & tests", href: "/services#children-teens" },
          { label: "Book a session", href: "/contact" },
        ],
      },
      {
        slug: "school-burnout",
        term: "School burnout",
        short:
          "School burnout is sustained exhaustion, cynicism about studying, and a collapse in motivation caused by prolonged academic pressure — not laziness.",
        detail: [
          "It often gets read as a discipline problem, which makes it worse: more pressure applied to a system that is already past capacity. The signs to watch for are a drop in engagement rather than a drop in marks, which usually follows later.",
          "Support looks at load, sleep, perfectionism, and what the young person believes will happen if they don't perform.",
        ],
        related: [{ label: "Children & teens", href: "/services#children-teens" }],
      },
    ],
  },
  {
    slug: "reflective-guidance",
    title: "Reflective guidance (astrology & tarot)",
    intro:
      "How these are used here, and — just as importantly — how they aren't. Counselling is the foundation; these are optional tools some clients find meaningful alongside it.",
    entries: [
      {
        slug: "reflective-tool",
        term: "Reflective tool",
        short:
          "A reflective tool is a prompt for self-examination — something to think with — rather than a source of information about the future.",
        detail: [
          "At Serene Step, astrology and tarot are used only in this sense. They are never a substitute for mental-health treatment, and are never used to predict what will happen.",
          "Any client who would rather not use them simply says so, and they never come up. Counselling stands entirely on its own.",
        ],
        related: [
          { label: "How we frame this", href: "/services#astrology-tarot" },
        ],
      },
      {
        slug: "birth-chart-analysis",
        term: "Birth chart analysis",
        short:
          "Here, a birth chart is used as a structured starting point for discussing personality patterns, emotional needs and relationship style — always alongside psychological understanding.",
        detail: [
          "The chart's themes are connected to concepts that do the actual work: self-esteem, attachment style, emotional regulation, coping patterns, identity development.",
          "The intended outcome is self-awareness and a clearer sense of your own strengths and needs — not a forecast.",
        ],
        related: [
          { label: "Birth chart analysis", href: "/services#birth-chart-analysis" },
        ],
      },
      {
        slug: "tarot-as-reflection",
        term: "Tarot as reflection",
        short:
          "A tarot session here is a guided conversation in which the cards provide images and questions to think about — the insight comes from you, not from the deck.",
        detail: [
          "Sessions are organised around a focus — relationships, wellbeing, career, meaning, a current crossroads — and what surfaces is connected back to psychological ideas like trust, boundaries, motivation, and decision-making.",
          "You leave with clearer questions and practical direction, not a prediction.",
        ],
        related: [
          { label: "Tarot guidance sessions", href: "/services#astrology-tarot" },
        ],
      },
    ],
  },
];

/** Flat list, for JSON-LD and the llms documents. */
export const glossaryEntries = glossary.flatMap((cluster) => cluster.entries);
