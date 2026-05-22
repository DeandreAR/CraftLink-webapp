import type { LegalBundleDictionary } from "@/i18n/types";

export const legalEn: LegalBundleDictionary = {
  backToHome: "Back to home",
  lastUpdated: "Last updated",
  updatedDate: "22 May 2026",
  pages: {
    mentionsLegales: {
      metaTitle: "Legal notice — CraftLink",
      metaDescription: "Publisher, hosting and liability information for CraftLink.",
      title: "Legal notice",
      intro:
        "Information provided in accordance with applicable French and EU transparency requirements for online services.",
      sections: [
        {
          title: "Publisher",
          paragraphs: [
            "The craftlink website (the “Site”) is published by CraftLink, a SaaS solution for tradesperson storefronts and lead capture.",
            "Contact: contact@craftlink.fr",
            "Legal status: company registration in progress — definitive details (form, share capital, trade register) will be updated upon incorporation.",
          ],
        },
        {
          title: "Publication director",
          paragraphs: ["The publication director is CraftLink’s legal representative."],
        },
        {
          title: "Hosting",
          paragraphs: [
            "The Site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.",
            "Application data (accounts, leads) may be processed via Supabase (EU / standard contractual clauses where applicable).",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "All Site elements (text, visuals, logo, structure, code) are protected. Unauthorised reproduction is prohibited.",
          ],
        },
        {
          title: "Liability",
          paragraphs: [
            "CraftLink endeavours to keep published information accurate. The publisher cannot be held liable for damage arising from use of the Site or temporary unavailability.",
          ],
        },
        {
          title: "Hyperlinks",
          paragraphs: [
            "The Site may link to third-party websites over which CraftLink has no control.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["For any Site-related question: contact@craftlink.fr"],
        },
      ],
    },
    privacy: {
      metaTitle: "Privacy policy — CraftLink",
      metaDescription:
        "GDPR: purposes, legal bases, retention periods and data subject rights.",
      title: "Privacy policy",
      intro:
        "CraftLink is committed to protecting personal data in accordance with Regulation (EU) 2016/679 (GDPR) and applicable national law.",
      sections: [
        {
          title: "Data controller",
          paragraphs: [
            "CraftLink acts as controller for data collected through the Site and the tradesperson workspace.",
            "Privacy contact: contact@craftlink.fr",
          ],
        },
        {
          title: "Data we collect",
          list: [
            "Tradesperson account data: name, email, phone, trade activity.",
            "Client lead data: contact details, job description, area, urgency, voice recordings where used.",
            "Technical data: logs, IP address, session identifiers, cookies (see cookie policy).",
          ],
        },
        {
          title: "Purposes and legal bases",
          list: [
            "Providing the service (account, pro page, enquiries) — contract performance.",
            "Support and security — legitimate interest.",
            "Billing and legal obligations — legal obligation.",
            "Audience measurement (if accepted) — consent.",
            "Limited B2B outreach — legitimate interest or consent depending on channel.",
          ],
        },
        {
          title: "Retention",
          list: [
            "Active tradesperson account: contract duration + 3 years for evidence and customer relations.",
            "Leads: per account settings, 24 months by default unless deleted earlier.",
            "Consent-based cookies: up to 13 months.",
            "Technical logs: 12 months.",
          ],
        },
        {
          title: "Recipients and processors",
          paragraphs: [
            "Data is accessible to authorised CraftLink staff and processors (hosting, database, AI transcription, messaging) strictly for the stated purposes. Contractual safeguards (DPA / SCCs) are in place where required.",
          ],
        },
        {
          title: "Transfers outside the EEA",
          paragraphs: [
            "Where tools involve transfers outside the European Economic Area, CraftLink relies on appropriate mechanisms (adequacy decisions, standard contractual clauses, supplementary measures).",
          ],
        },
        {
          title: "Your rights",
          list: [
            "Access, rectification, erasure, restriction and objection.",
            "Data portability where applicable.",
            "Withdraw consent at any time (cookies, marketing).",
            "Lodge a complaint with your supervisory authority (in France: CNIL).",
          ],
          paragraphs: [
            "To exercise your rights: contact@craftlink.fr — we respond within one month.",
          ],
        },
        {
          title: "Security",
          paragraphs: [
            "Organisational and technical measures include encryption in transit (HTTPS), access control, backups and logging.",
          ],
        },
        {
          title: "Children",
          paragraphs: [
            "The service targets professionals. We do not knowingly collect data relating to minors.",
          ],
        },
      ],
    },
    cookies: {
      metaTitle: "Cookie policy — CraftLink",
      metaDescription: "Cookie types, purposes, duration and how to manage consent.",
      title: "Cookie policy",
      intro:
        "When you visit the Site, trackers may be placed on your device. You can accept, refuse or configure non-essential cookies via the banner shown on the Site.",
      sections: [
        {
          title: "What is a cookie?",
          paragraphs: [
            "A cookie is a small text file stored on your device. Similar technologies (localStorage, pixels) may be used for the same purposes.",
          ],
        },
        {
          title: "Strictly necessary cookies",
          paragraphs: [
            "Required for the Site to function (session, security, remembering your cookie choices). No consent required.",
          ],
          list: [
            "craftlink_cookie_consent — stores your choice — 13 months — CraftLink",
          ],
        },
        {
          title: "Analytics cookies",
          paragraphs: [
            "Placed only if you accept them. They help us understand how the Site is used in order to improve the service.",
          ],
          list: [
            "Analytics tools (e.g. privacy-friendly solution or Google Analytics if enabled) — duration per tool — see consent banner.",
          ],
        },
        {
          title: "Marketing cookies",
          paragraphs: [
            "Placed only if you accept them. Used to measure campaigns or deliver personalised content.",
          ],
        },
        {
          title: "Managing preferences",
          paragraphs: [
            "You can change your choice at any time by clearing browser storage or reopening the panel from the “Cookies” link in the footer.",
            "You can also configure your browser to block cookies.",
          ],
        },
      ],
    },
    terms: {
      metaTitle: "Terms of use — CraftLink",
      metaDescription:
        "CraftLink terms: scope, access, obligations and liability.",
      title: "Terms of use",
      intro:
        "These terms govern access to and use of the CraftLink service by tradespeople and Site visitors.",
      sections: [
        {
          title: "Purpose",
          paragraphs: [
            "CraftLink provides a professional page, a single capture link (text and voice), enquiry sorting and handoff to the tradesperson’s messaging apps.",
          ],
        },
        {
          title: "Access",
          paragraphs: [
            "Registration requires accurate information. The tradesperson is responsible for keeping credentials confidential.",
          ],
        },
        {
          title: "Tradesperson obligations",
          list: [
            "Use the service lawfully and respect client rights.",
            "Obtain any required authorisation to record and process prospect data.",
            "Do not publish unlawful, misleading or infringing content.",
          ],
        },
        {
          title: "Data and content",
          paragraphs: [
            "The tradesperson remains responsible for data collected through their page. CraftLink acts as processor for lead processing under the privacy policy and contractual terms.",
          ],
        },
        {
          title: "Pricing",
          paragraphs: [
            "Essential, Pro and Options plans are described on the Site. CraftLink may change pricing with prior notice to subscribers.",
          ],
        },
        {
          title: "Availability",
          paragraphs: [
            "CraftLink targets high availability without guaranteeing uninterrupted access. Maintenance may be scheduled.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "CraftLink grants a non-exclusive licence to use the platform. Tradesperson content remains theirs; they grant CraftLink rights needed to host and display it.",
          ],
        },
        {
          title: "Liability",
          paragraphs: [
            "CraftLink is not party to contracts between the tradesperson and end clients. CraftLink’s liability is limited to direct damage, capped at fees paid in the last 12 months, except gross negligence or wilful misconduct.",
          ],
        },
        {
          title: "Termination",
          paragraphs: [
            "The tradesperson may cancel per signup terms. CraftLink may suspend accounts for serious breach of these terms.",
          ],
        },
        {
          title: "Governing law",
          paragraphs: [
            "These terms are governed by French law. French courts have jurisdiction subject to mandatory consumer rules where applicable.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["contact@craftlink.fr"],
        },
      ],
    },
  },
};
