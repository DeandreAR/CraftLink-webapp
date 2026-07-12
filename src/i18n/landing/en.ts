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
  pourquoi: {
    header: {
      index: "01",
      eyebrow: "Before / After",
      title: "Fewer vague messages. More real jobs.",
      titleHighlight: "real jobs",
      lead: "Between jobs, messages pile up everywhere. CraftLink centralises and sorts before you catch up in the evening.",
    },
    badge: "Zero maintenance · No webmaster",
    badgeHint: "You work. The tool sorts requests.",
    without: {
      label: "Before CraftLink",
      title:
        "Dozens of scattered messages (SMS, Facebook, WhatsApp) ➡️ Half lack precise details.",
      bullets: [],
    },
    with: {
      label: "After CraftLink",
      title:
        "Clear, complete requests in one place ➡️ You know exactly where to start.",
      bullets: [],
    },
  },
  features: {
    header: {
      index: "02",
      eyebrow: "How it works",
      title: "Three steps. No wasted time.",
      titleHighlight: "No wasted time",
      lead: "1. The client explains their need in 1 minute (in writing or by voice message). 2. CraftLink organises and sorts the request automatically. 3. You follow up only on serious, complete files.",
    },
    cards: [
      {
        eyebrow: "Voice",
        title: "Client explains, you read what matters",
        description:
          "Voice messages are transcribed. You understand the job without chasing the client three times.",
      },
      {
        eyebrow: "Auto sort",
        title: "Serious requests rise to the top",
        description:
          "Automatic request sorting: timeline, area, completeness. You quote the right jobs first.",
      },
      {
        eyebrow: "WhatsApp",
        title: "Follow up with the file in front of you",
        description:
          "WhatsApp stays your tool. The client arrives with their need already summarised.",
      },
      {
        eyebrow: "One link",
        title: "One link everywhere",
        description: "Instagram bio, Facebook, QR on your van: one pro entry, everywhere.",
      },
      {
        eyebrow: "Export",
        title: "Contacts ready to follow up",
        description: "Export requests for your usual follow-up or quoting tools.",
      },
    ],
    formBlock: {
      eyebrow: "Client form",
      title: "The right info from the first message",
      description:
        "Nature of request, area, timeline, photos or voice: no more vague \"hello, need a quote\".",
      fields: [
        "Nature of request",
        "Area / town",
        "Urgency or schedule",
        "Photos or voice notes",
        "Direct contact",
      ],
    },
  },
  metiers: {
    header: {
      index: "03",
      eyebrow: "Building trades",
      title: "Built for your trade",
      lead: "One link, one form, automatic sorting: fewer scattered messages, more time on jobs that pay.",
    },
    cards: [
      {
        metier: "Electrician",
        angle: "Call-out or panel upgrade: the client states the problem, you get a file ready to quote.",
      },
      {
        metier: "Plumber / heating",
        angle: "Leak or boiler breakdown: the client describes by voice what they see at home.",
      },
      {
        metier: "Joiner / carpenter",
        angle: "Windows, doors, fitted units: dimensions and need without 15 scattered messages.",
      },
      {
        metier: "Locksmith",
        angle: "Locked out: area and urgency identified straight away to plan the visit.",
      },
      {
        metier: "Drywaller",
        angle: "Partitions or insulation: rooms and constraints clear before your visit.",
      },
      {
        metier: "Painter",
        angle: "Surfaces and finishes: client specifies m² and timeline before quoting.",
      },
      {
        metier: "Landscaper",
        angle: "Maintenance or garden design: area and photos guide your first visit.",
      },
      {
        metier: "Roofer",
        angle: "Leak or reroof: floor, urgency and access described before you travel.",
      },
      {
        metier: "Tiler",
        angle: "Bathroom or large format: dimensions and photos reduce nasty surprises.",
      },
      {
        metier: "Timber framer",
        angle: "Frame or loft: job type and site access clear in advance.",
      },
      {
        metier: "Mason & general builder",
        angle: "Structural work or extension: one entry for small jobs and tender responses.",
      },
      {
        metier: "General renovation / turnkey contractor",
        angle:
          "Project management, extensions or full renovations: AI structures rooms, volumes and work types to save hours on your first quotes.",
      },
    ],
  },
};
