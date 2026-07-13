export type SubscriptionBillingSnapshot = {
  nextBillingDate: string | null;
  interval: "month" | "year" | null;
  customerId: string | null;
  subscriptionId: string | null;
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid" | null;
};
