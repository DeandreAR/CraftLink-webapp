import type { CSSProperties } from "react";
import type { VitrineStatBadge } from "@/domain/vitrine";

type VitrineStatBadgesProps = {
  badges: VitrineStatBadge[];
  googleBusinessUrl?: string | null;
  /** Fond sombre (page entière) : pastille toujours lisible. */
  onDarkCover?: boolean;
  /** Couleur marque — bordure / accent. */
  accentColor?: string;
};

function YellowStars({ count = 5 }: { count?: number }) {
  return (
    <span
      className="inline-flex gap-px text-[12px] leading-none text-amber-400"
      aria-hidden
    >
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

function pillStyle(accent: string | undefined, onDarkCover: boolean): CSSProperties {
  const border = accent?.trim() || "#dadce0";
  return {
    backgroundColor: "#ffffff",
    color: "#202124",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: onDarkCover ? "rgba(255,255,255,0.85)" : border,
    boxShadow: onDarkCover
      ? "0 4px 16px rgba(0,0,0,0.28)"
      : "0 1px 2px rgba(60,64,67,0.12), 0 1px 3px rgba(60,64,67,0.08)",
  };
}

/**
 * Badges avis Google — pill lisible (fond blanc, texte sombre, bordure couleur).
 */
export function VitrineStatBadges({
  badges,
  googleBusinessUrl,
  onDarkCover = false,
  accentColor,
}: VitrineStatBadgesProps) {
  if (badges.length === 0) return null;

  const className =
    "inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] transition hover:brightness-[0.98]";

  return (
    <ul className="relative z-20 mt-4 flex flex-wrap justify-center gap-2">
      {badges.map((badge) => {
        const href = resolveBadgeHref(badge, googleBusinessUrl);
        const isRating = badge.kind === "google_rating";
        const style = pillStyle(accentColor, onDarkCover);

        const content = isRating ? (
          <span className="inline-flex items-center gap-1.5">
            <span>{badge.rating ?? badge.label.replace(/\s*★.*/, "").trim()}</span>
            <YellowStars count={badge.starCount ?? 5} />
          </span>
        ) : (
          <span>{badge.label}</span>
        );

        if (href) {
          return (
            <li key={badge.id}>
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
          <li key={badge.id}>
            <span className={className} style={style}>
              {content}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
