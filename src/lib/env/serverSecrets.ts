/** Token Apify — accepte APIFY_TOKEN (code) ou APIFY_API_TOKEN (alias Vercel / docs). */
export function getApifyToken(): string | undefined {
  return (
    process.env.APIFY_TOKEN?.trim() ??
    process.env.APIFY_API_TOKEN?.trim() ??
    undefined
  );
}
