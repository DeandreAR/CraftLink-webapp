export type GoogleBusinessStatsResult = {
  rating: number | null;
  reviews: number | null;
  googleBusinessUrl: string | null;
};

export async function fetchGoogleBusinessStats(
  identifier: string,
  fallbackQuery?: string,
): Promise<GoogleBusinessStatsResult> {
  const res = await fetch("/api/google/business-stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier,
      ...(fallbackQuery ? { fallbackQuery } : {}),
    }),
  });

  const json = (await res.json()) as GoogleBusinessStatsResult & { error?: string };

  if (!res.ok) {
    throw new Error(json.error ?? "GOOGLE_STATS_FAILED");
  }

  return {
    rating: typeof json.rating === "number" ? json.rating : null,
    reviews: typeof json.reviews === "number" ? json.reviews : null,
    googleBusinessUrl:
      typeof json.googleBusinessUrl === "string" ? json.googleBusinessUrl : null,
  };
}
