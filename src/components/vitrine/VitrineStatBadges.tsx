import type { CSSProperties } from "react";
import type { VitrineStatBadge } from "@/domain/vitrine";

type VitrineStatBadgesProps = {
  badges: VitrineStatBadge[];
  googleBusinessUrl?: string | null;
  onDarkCover?: boolean;
};

/** Étoiles Google jaunes. */
function GoogleStars({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-[12px] w-[12px] shrink-0"
          fill="#fbbc04"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.5l2.83 6.64 7.17.64-5.4 4.72 1.64 7-6.24-3.72-6.24 3.72 1.64-7-5.4-4.72 7.17-.64L12 2.5z" />
        </svg>
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

function pillStyle(onDarkCover: boolean): CSSProperties {
  return {
    backgroundColor: "#ffffff",
    color: "#3d2914",
    border: "1px solid rgba(61, 41, 20, 0.12)",
    boxShadow: onDarkCover
      ? "0 8px 20px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.95)"
      : "0 6px 16px rgba(61,41,20,0.12), 0 2px 4px rgba(61,41,20,0.08), inset 0 1px 0 #ffffff",
  };
}

export function VitrineStatBadges({
  badges,
  googleBusinessUrl,
  onDarkCover = false,
}: VitrineStatBadgesProps) {
  if (!badges.length) return null;

  const className =
    "inline-flex items-center rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.01em] transition hover:brightness-[0.98] active:translate-y-px";

  return (
    <ul
      className="relative z-30 mt-4 flex flex-wrap justify-center gap-2"
      aria-label="Statistiques"
    >
      {badges.map((badge) => {
        const href = resolveBadgeHref(badge, googleBusinessUrl);
        const isGoogle =
          badge.kind === "google_rating" || badge.kind === "google_reviews";
        const style = pillStyle(onDarkCover);
        const starCount = badge.starCount && badge.starCount > 0 ? badge.starCount : 5;

        // Avis Google : toujours note (si dispo) + étoiles
        const content = isGoogle ? (
          <span className="inline-flex items-center gap-1.5">
            {badge.kind === "google_rating" || badge.rating ? (
              <span style={{ color: "#3d2914" }}>
                {badge.rating ?? badge.label.replace(/\s*[·•].*/, "").trim()}
              </span>
            ) : null}
            <GoogleStars count={starCount} />
            {badge.kind === "google_reviews" && !badge.rating ? (
              <span style={{ color: "#3d2914" }}>{badge.label}</span>
            ) : badge.kind === "google_rating" && badge.label.includes("·") ? (
              <span style={{ color: "#3d2914" }} className="font-medium opacity-80">
                {badge.label.slice(badge.label.indexOf("·"))}
              </span>
            ) : null}
          </span>
        ) : (
          <span style={{ color: "#3d2914" }}>{badge.label}</span>
        );

        if (href) {
          return (
            <li key={badge.id} className="list-none">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={style}
              >
                {content}
              </a>
            </li>
          );
        }

        return (
          <li key={badge.id} className="list-none">
            <span className={className} style={style}>
              {content}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
