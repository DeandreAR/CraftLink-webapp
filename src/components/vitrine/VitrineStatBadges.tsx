import type { VitrineStatBadge } from "@/domain/vitrine";

type VitrineStatBadgesProps = {
  badges: VitrineStatBadge[];
  googleBusinessUrl?: string | null;
};

function YellowStars({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex gap-px text-[11px] leading-none text-amber-400" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

function resolveBadgeHref(
  badge: VitrineStatBadge,
  googleBusinessUrl?: string | null,
): string | undefined {
  if (badge.href) return badge.href;
  if (
    googleBusinessUrl &&
    (badge.kind === "google_reviews" || badge.kind === "google_rating")
  ) {
    return googleBusinessUrl;
  }
  return undefined;
}

export function VitrineStatBadges({
  badges,
  googleBusinessUrl,
}: VitrineStatBadgesProps) {
  if (badges.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-2">
      {badges.map((badge) => {
        const href = resolveBadgeHref(badge, googleBusinessUrl);
        const isRating = badge.kind === "google_rating";
        const className =
          "rounded-full border border-neutral-900 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral-900 transition hover:bg-neutral-50";

        const content = isRating ? (
          <span className="inline-flex items-center gap-1.5 normal-case">
            <span>{badge.rating ?? badge.label.replace(/\s*★.*/, "").trim()}</span>
            <YellowStars count={badge.starCount ?? 5} />
          </span>
        ) : (
          badge.label
        );

        if (href) {
          return (
            <li key={badge.id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} inline-flex`}
              >
                {content}
              </a>
            </li>
          );
        }

        return (
          <li key={badge.id}>
            <span className={`inline-flex ${className}`}>{content}</span>
          </li>
        );
      })}
    </ul>
  );
}
