export type SubscriptionBillingSnapshot = {
  nextBillingDate: string | null;
  interval: "month" | "year" | null;
};
