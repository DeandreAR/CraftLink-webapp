import type { VitrineDictionary } from "@/i18n/types";

export const vitrineEn: VitrineDictionary = {
  details: {
    back: "Back to profile",
    servicesTitle: "Services",
    servicesHint: "Select what matches your need",
    captureTitle: "Your request",
  },
  form: {
    fullName: "Your name",
    fullNamePlaceholder: "John Smith",
    phone: "Phone",
    phonePlaceholder: "+33 6 12 34 56 78",
    urgency: "Urgency",
    urgencyOptions: {
      urgent: "Urgent (within 24h)",
      this_week: "This week",
      flexible: "Not urgent",
    },
    project: "Describe your need",
    projectPlaceholder: "Issue type, area, access, constraints…",
    collaborationToggle: "I’m a pro looking to collaborate",
    proCompanyName: "Company name",
    proCompanyPlaceholder: "Business or brand name",
    proProject: "Collaboration project",
    proProjectPlaceholder: "Partnership type, volume, timeline…",
    submit: "Send my request",
    submitting: "Sending…",
    successTitle: "Request sent",
    successBody:
      "Your tradesperson received a structured request and will get back to you soon.",
    errorTitle: "Could not send",
    errorBody: "Check your connection and try again.",
    smsAck: "✓ You’ll instantly receive a confirmation SMS once submitted.",
  },
  voice: {
    title: "Describe your project by voice",
    record: "Record my request by voice",
    recording: "Recording…",
    stop: "Tap to finish",
    added: "Voice message recorded",
  },
  services: {
    priceHt: "excl. VAT",
  },
  poweredBy: "Powered by CraftLink",
};
