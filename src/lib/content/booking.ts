/**
 * Every word the booking flow says — the page copy, the assistant's script, the
 * consent line and the crisis note. Kept here, not in the components, for the
 * same reason as the rest of `src/lib/content`: the pages, the JSON-LD and the
 * generated llms.txt all read from one source, so they can't drift.
 *
 * The tone is the practice's own: unhurried, plain, no clinical distance. The
 * person reading this may have spent weeks working up to it.
 */

export const bookingPage = {
  eyebrow: "Book a session",
  intro:
    "Choose what kind of support you're looking for, pick a time that suits you, and tell us a little about what's bringing you here. It takes about a minute, and nothing is confirmed until we've written back.",
  /** Shown beside the flow — what happens after they press the button. */
  whatHappensNext: [
    {
      title: "You choose a time",
      text: "Pick from the times that are genuinely free. Nothing is charged, and nothing is committed.",
    },
    {
      title: "We write back",
      text: "Usually within a couple of working days, confirming the time or offering another that works.",
    },
    {
      title: "Your session",
      text: "You'll get everything you need beforehand — a private video link, the address, or a call at the agreed time.",
    },
  ],
  reassurance: [
    "Reaching out isn't a commitment.",
    "Everything you share stays confidential.",
    "You can move or cancel your session at any time.",
  ],
} as const;

/**
 * The assistant's script. One line per step — the chat shell speaks these, the
 * full-page stepper uses them as its step headings, so the two never disagree
 * about what's being asked.
 */
export const bookingScript = {
  greeting:
    "Hello — I can help you find a time. A few short questions, and you can change any answer as we go.",
  session: {
    prompt: "What kind of support are you looking for?",
    heading: "What kind of support?",
  },
  mode: {
    prompt: "And how would you like to meet?",
    heading: "How would you like to meet?",
  },
  time: {
    prompt: "Here's when we're free. Which suits you?",
    heading: "Choose a time",
  },
  details: {
    prompt: "Last part — who should we write back to?",
    heading: "A little about you",
  },
  done: {
    prompt: "That's everything. Thank you for taking this step.",
    heading: "Your request is with us",
  },
  /** The floating button, and its open/close labels. */
  launcher: {
    label: "Book a session",
    open: "Open the booking assistant",
    close: "Close the booking assistant",
  },
} as const;

export const bookingLabels = {
  firstTimeQuestion: "Have you been to us before?",
  firstTimeYes: "This is my first time",
  firstTimeNo: "I've been before",
  concernLabel: "What's this about? (optional)",
  messageLabel: "Anything you'd like us to know? (optional)",
  messagePlaceholder:
    "As much or as little as you feel comfortable with. You can leave this blank.",
  consent:
    "I'm happy for Serene Step to use these details to contact me about this session.",
  submit: "Request this session",
  submitting: "Sending…",
  noTimes:
    "There are no free times on this day. Try another — or message us and we'll find one together.",
  loadingTimes: "Finding free times…",
  noTimesAtAll:
    "There are no free times online at the moment. Please send us a message and we'll sort something out.",
} as const;

/**
 * Load-bearing, not boilerplate. A booking form is not a crisis service, and
 * saying so plainly — with somewhere else to go — matters more than the flow
 * looking tidy. Keep this visible on the time step and in the assistant.
 */
export const crisisNote = {
  title: "If you need help right now",
  text: "This form isn't monitored around the clock. If you're in immediate danger or thinking about harming yourself, please contact your local emergency number or a crisis helpline now — don't wait for a reply here.",
} as const;

/** Shown under the confirmation, so nobody is left wondering. */
export const bookingConfirmation = {
  heading: "Your request is with us",
  body: "We've emailed you a copy. Someone will write back within a couple of working days to confirm the time — nothing is booked until then.",
  note: "Didn't get the email? Check your spam folder, or message us on WhatsApp and we'll confirm it by hand.",
} as const;

/** Copy for the client's own /booking/[token] page. */
export const managePage = {
  title: "Your booking",
  pendingNote:
    "This time is being held while we confirm it. We'll email you as soon as it's settled.",
  confirmedNote: "This session is confirmed. We're looking forward to seeing you.",
  cancelledNote:
    "This session is cancelled. Whenever you're ready, you're welcome to book another.",
  completedNote: "This session has taken place. Thank you for coming.",
  cancelPrompt: "Need to cancel?",
  cancelHint:
    "Plans change, and that's completely fine. Letting us know early means the time can go to someone else.",
  cancelAction: "Cancel this session",
  cancelConfirm: "Cancel this session? We'll email you to confirm.",
} as const;
