import { FaFacebook, FaGoogle } from "react-icons/fa6";
import type { VitrinePortfolioItem } from "@/domain/vitrine";

type VitrinePortfolioGalleryProps = {
  items: VitrinePortfolioItem[];
  title: string;
};

const INSTAGRAM_PROFILE_IFRAME_HEIGHT = 720;

function portfolioTileClass(isProfileFeed: boolean): string {
  if (isProfileFeed) {
    return "relative col-span-2 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:col-span-3";
  }

  return "relative aspect-square overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]";
}

function InstagramProfileEmbed({
  embedUrl,
  title,
  externalUrl,
}: {
  embedUrl: string;
  title: string;
  externalUrl?: string;
}) {
  return (
    <div className="flex flex-col">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full border-0"
        style={{ height: INSTAGRAM_PROFILE_IFRAME_HEIGHT }}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-t border-neutral-200/80 bg-white px-3 py-2 text-center text-[10px] font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          Instagram ↗
        </a>
      ) : null}
    </div>
  );
}

function ExternalPortfolioCard({ item }: { item: VitrinePortfolioItem }) {
  const href = item.externalUrl ?? "#";
  const isFacebook = item.source_type === "facebook";
  const isGoogle = item.source_type === "google";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full min-h-[96px] flex-col items-center justify-center gap-2 bg-white p-3 text-center transition hover:bg-neutral-50"
    >
      {isFacebook ? (
        <FaFacebook className="h-5 w-5 text-[#1877F2]" aria-hidden />
      ) : isGoogle ? (
        <FaGoogle className="h-5 w-5 text-[#4285F4]" aria-hidden />
      ) : null}
      <span className="line-clamp-2 text-[10px] font-semibold text-neutral-700">{item.alt ?? href}</span>
    </a>
  );
}

function isDisplayableGridItem(item: VitrinePortfolioItem): boolean {
  if (item.type === "instagram_embed") return false;
  if (item.type === "image") return Boolean(item.imageUrl);
  if (item.type === "external_link") return Boolean(item.externalUrl);
  return false;
}

function InstagramGridTile({ item }: { item: VitrinePortfolioItem }) {
  const href = item.externalUrl ?? "#";

  if (item.type === "image" && item.imageUrl) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        <img
          src={item.imageUrl}
          alt={item.alt ?? ""}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      </a>
    );
  }

  return null;
}

export function VitrinePortfolioGallery({
  items,
  title,
}: VitrinePortfolioGalleryProps) {
  const profileFeed = items.find((item) => item.type === "instagram_profile_embed");
  const gridItems = items.filter(
    (item) =>
      item.id !== profileFeed?.id &&
      item.type !== "instagram_profile_embed" &&
      isDisplayableGridItem(item),
  );
  const showProfileFeed = Boolean(profileFeed?.embedUrl) && gridItems.length === 0;

  if (!showProfileFeed && gridItems.length === 0) return null;

  return (
    <section className="mt-6 px-4 sm:px-5" aria-labelledby="portfolio-gallery-heading">
      <h2
        id="portfolio-gallery-heading"
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {title}
      </h2>

      {showProfileFeed && profileFeed?.embedUrl ? (
        <div className={`${portfolioTileClass(true)} w-full`}>
          <InstagramProfileEmbed
            embedUrl={profileFeed.embedUrl}
            title={profileFeed.alt ?? "Publications Instagram"}
            externalUrl={profileFeed.externalUrl}
          />
        </div>
      ) : null}

      {gridItems.length > 0 ? (
        <ul className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${showProfileFeed ? "mt-2" : ""}`}>
          {gridItems.map((item) => (
            <li key={item.id} className={portfolioTileClass(false)}>
              {item.type === "image" && item.imageUrl ? (
                item.source_type === "instagram" ? (
                  <InstagramGridTile item={item} />
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.alt ?? ""}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                )
              ) : item.type === "external_link" && item.externalUrl ? (
                <ExternalPortfolioCard item={item} />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
