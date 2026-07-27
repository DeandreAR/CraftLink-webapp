/** URL remote que Next.js Image peut optimiser (config `images.remotePatterns`). */
export function isNextOptimizableImageUrl(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) {
    return true; // chemin local /public
  }
  try {
    const host = new URL(src).hostname.toLowerCase();
    return (
      host.endsWith(".supabase.co") ||
      host === "getcraftlink.com" ||
      host === "www.getcraftlink.com"
    );
  } catch {
    return false;
  }
}
