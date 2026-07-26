export const ANALYTICS_EVENT_TYPES = [
  "page_view",
  "click_whatsapp",
  "click_affiliate",
  "form_submit",
  "voice_sent",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export function isAnalyticsEventType(value: string): value is AnalyticsEventType {
  return (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value);
}

export type AudienceMetrics = {
  pageViews: number;
  contactClicks: number;
  materialClicks: number;
  formSubmits: number;
  voiceSent: number;
};

export const EMPTY_AUDIENCE_METRICS: AudienceMetrics = {
  pageViews: 0,
  contactClicks: 0,
  materialClicks: 0,
  formSubmits: 0,
  voiceSent: 0,
};
