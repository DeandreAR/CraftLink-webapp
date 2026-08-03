import type { LandingExtendedDictionary } from "@/i18n/landing/types";

export const landingEn: LandingExtendedDictionary = {
  faqBlocks: [
    {
      title: "Getting started",
      items: [
        {
          q: "I'm not comfortable with technology.",
          a: "No jargon. Fill in the essentials, get a link for your bio or card. If you can send a WhatsApp, you can use CraftLink.",
        },
        {
          q: "I don't have time to build a website.",
          a: "Your page is ready in minutes. Services, area, contact — voice notes, sorting and WhatsApp work while you're on site.",
        },
        {
          q: "How long until I'm live?",
          a: "A few minutes to publish your link. Refine it later if needed.",
        },
      ],
    },
    {
      title: "Pricing and ROI",
      items: [
        {
          q: "It's too expensive for me.",
          a: "A free tier lets you try. One won job pays for the subscription. A vague request lost doesn't come back.",
        },
      ],
    },
    {
      title: "How it works",
      items: [
        {
          q: "How do clients find me?",
          a: "Same as today: networks, word of mouth, flyers. The difference: they use your link and you get a written request or transcribed voice note.",
        },
        {
          q: "Is it right for my trade?",
          a: "Yes if you quote in construction: electrician, plumber, joiner, painter, mason, roofer, general renovation… CraftLink sorts requests before you handle them.",
        },
        {
          q: "Does it replace a website?",
          a: "For many tradespeople it's the main showcase: a clear page plus lead capture. A big site can stay a complement.",
        },
      ],
    },
    {
      title: "Instagram, Facebook and WhatsApp",
      items: [
        {
          q: "Does it work with only Facebook or Instagram?",
          a: "Yes. Same link in bio, on Facebook, in stories or on a site QR code.",
        },
        {
          q: "Can I keep WhatsApp?",
          a: "Yes. WhatsApp stays your channel. CraftLink prepares the file first: need, area, timeline, photos if needed.",
        },
      ],
    },
    {
      title: "Data and support",
      items: [
        {
          q: "Is my data secure?",
          a: "Secure login and professional practices. Details in our privacy policy (GDPR).",
        },
      ],
    },
  ],
  cta: {
    title: "Ready to receive requests",
    titleHighlight: "clear and complete",
    lead: "Create your page in minutes: one link, structured files, WhatsApp as usual.",
    button: "Create my page now",
  },
  control: {
    header: {
      index: "01",
      eyebrow: "How it works",
      title: "Take back control of your messages. Zero wasted time.",
      titleHighlight: "Zero wasted time.",
      lead: "One flow: the client explains, CraftLink sorts, you quote the right jobs.",
    },
    imageAlt:
      "Tradesperson in a yellow hard hat checking their phone with a mission accepted notification.",
    compare: {
      eyebrow: "Before / After",
      without: {
        label: "The chaos",
        title:
          "Dozens of scattered messages — half lack the details you need to quote.",
        items: [
          "SMS, Facebook, WhatsApp: everything is scattered",
          "Blurry photos, incomplete address, vague urgency",
          "You chase clients 3 times before you can price the job",
          "Cold outreach and useless marketing pitches clogging your inbox",
        ],
      },
      with: {
        label: "CraftLink clarity",
        title:
          "Complete requests in one place — you know exactly where to start.",
        items: [
          "Structured file: area, urgency, scope of work",
          "Voice note transcribed automatically if they prefer talking",
          "WhatsApp opens with full context already in hand",
          "Less spammy outreach: CraftLink filters off-topic marketing",
        ],
      },
    },
    steps: [
      {
        index: "Step 1",
        title: "The client explains their need (text or voice)",
        lead: "No more scattered SMS and messages. Everything lands cleanly in one place.",
      },
      {
        index: "Step 2",
        title: "CraftLink centralizes and organizes your requests instantly",
        lead: "All key information is sorted and grouped in a clean dashboard. No message gets lost.",
      },
      {
        index: "Step 3",
        title: "Run your business and follow up with clients fast",
        lead: "See your jobs at a glance, validate serious files and follow up on the right leads in one click.",
      },
    ],
  },
  metiers: {
    header: {
      index: "02",
      eyebrow: "Building trades",
      title: "Built for your trade",
      lead: "One link, one form, automatic sorting: fewer scattered messages, more time on jobs that pay.",
    },
    imageAlt:
      "Two smiling building tradespeople on a renovation site with a stepladder.",
    showAllMetiers: "Show all trades",
    showLessMetiers: "Show fewer",
    urgencyBadge: "Urgent option enabled",
    quoteBadge: "100% Quote",
    selectMetierHint: "Select a trade",
    cards: [
      {
        metierKey: "RENOVATION_GENERALE",
        metier: "General renovation / turnkey contractor",
        angle:
          "Project tracking, extensions or full renovations: rooms, volumes and work types structured for your first quotes.",
      },
      {
        metierKey: "ELECTRICIEN",
        metier: "Electrician",
        angle:
          "Fault-finding or panel upgrade: the client states the problem, you get a file ready to quote.",
      },
      {
        metierKey: "PLOMBIER",
        metier: "Plumber / heating",
        angle: "Leak or boiler breakdown: the client describes by voice what they see at home.",
      },
      {
        metierKey: "MACON",
        metier: "Mason & general builder",
        angle: "Structural work or extension: one entry for small jobs and tender responses.",
      },
      {
        metierKey: "PLAQUISTE",
        metier: "Drywaller",
        angle: "Partitions or insulation: rooms and constraints clear before your visit.",
      },
      {
        metierKey: "PEINTRE",
        metier: "Painter",
        angle: "Surfaces and finishes: client specifies m² and timeline before quoting.",
      },
      {
        metierKey: "MENUISIER",
        metier: "Joiner / carpenter",
        angle: "Windows, doors, fitted units: dimensions and need without 15 scattered messages.",
      },
      {
        metierKey: "SERRURIER",
        metier: "Locksmith",
        angle: "Locked out: area and urgency identified straight away to plan the visit.",
      },
      {
        metierKey: "PAYSAGISTE",
        metier: "Landscaper",
        angle: "Maintenance or garden design: area and photos guide your first visit.",
      },
      {
        metierKey: "COUVREUR",
        metier: "Roofer",
        angle: "Leak or reroof: floor, urgency and access described before you travel.",
      },
      {
        metierKey: "CARRELEUR",
        metier: "Tiler",
        angle: "Bathroom or large format: dimensions and photos reduce nasty surprises.",
      },
      {
        metierKey: "CHARPENTIER",
        metier: "Timber framer",
        angle: "Frame or loft: job type and site access clear in advance.",
      },
    ],
  },
};
