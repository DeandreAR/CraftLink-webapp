import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa6";
import type { VitrinePortfolioItem } from "@/domain/vitrine";

type VitrinePortfolioGalleryProps = {
  items: VitrinePortfolioItem[];
  title: string;
};

const INSTAGRAM_PROFILE_VIEW_HEIGHT = 260;
const INSTAGRAM_PROFILE_IFRAME_HEIGHT = 420;

function portfolioTileClass(isProfileFeed: boolean): string {
  if (isProfileFeed) {
    return "relative col-span-2 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:col-span-3";
  }

  return "relative aspect-square overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]";
}

function InstagramEmbedFrame({
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
      <div
        className="scrollbar-soft w-full overflow-x-hidden overflow-y-auto"
        style={{ height: INSTAGRAM_PROFILE_VIEW_HEIGHT, WebkitOverflowScrolling: "touch" }}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="w-full border-0"
          style={{ height: INSTAGRAM_PROFILE_IFRAME_HEIGHT }}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
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

function InstagramLinkCard({ item }: { item: VitrinePortfolioItem }) {
  const href = item.externalUrl ?? "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full min-h-[96px] flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F58529]/15 via-[#DD2A7B]/10 to-[#8134AF]/15 p-3 text-center transition hover:from-[#F58529]/25 hover:via-[#DD2A7B]/15 hover:to-[#8134AF]/20"
    >
      <FaInstagram className="h-7 w-7 text-[#E4405F]" aria-hidden />
      <span className="line-clamp-2 text-[11px] font-semibold text-neutral-800">
        {item.alt ?? "Instagram"}
      </span>
    </a>
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
      ) : (
        <FaInstagram className="h-5 w-5 text-[#E4405F]" aria-hidden />
      )}
      <span className="line-clamp-2 text-[10px] font-semibold text-neutral-700">{item.alt ?? href}</span>
    </a>
  );
}

export function VitrinePortfolioGallery({
  items,
  title,
}: VitrinePortfolioGalleryProps) {
  if (items.length === 0) return null;

  const profileFeed = items.find((item) => item.type === "instagram_profile_embed");
  const gridItems = profileFeed ? items.filter((item) => item.id !== profileFeed.id) : items;

  return (
    <section className="mt-6 px-4 sm:px-5" aria-labelledby="portfolio-gallery-heading">
      <h2
        id="portfolio-gallery-heading"
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {title}
      </h2>

      {profileFeed?.embedUrl ? (
        <div className={`${portfolioTileClass(true)} w-full`}>
          <InstagramEmbedFrame
            embedUrl={profileFeed.embedUrl}
            title={profileFeed.alt ?? "Publications Instagram"}
            externalUrl={profileFeed.externalUrl}
          />
        </div>
      ) : null}

      {gridItems.length > 0 ? (
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {gridItems.map((item) => (
            <li key={item.id} className={portfolioTileClass(false)}>
              {item.type === "instagram_embed" ? (
                item.externalUrl ? (
                  <InstagramLinkCard item={item} />
                ) : (
                  <div className="flex h-full min-h-[96px] items-center justify-center bg-neutral-50 p-3 text-center text-[11px] text-neutral-600">
                    {item.alt ?? "Instagram"}
                  </div>
                )
              ) : item.type === "image" && item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
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
