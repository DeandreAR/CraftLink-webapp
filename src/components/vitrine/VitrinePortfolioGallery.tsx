import type { VitrinePortfolioItem } from "@/domain/vitrine";

type VitrinePortfolioGalleryProps = {
  items: VitrinePortfolioItem[];
  title: string;
};

function portfolioTileClass(index: number, isProfileFeed: boolean): string {
  if (isProfileFeed) {
    return "relative col-span-2 overflow-hidden rounded-[20px] border border-neutral-200/80 bg-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]";
  }

  const base =
    "relative overflow-hidden rounded-[20px] border border-neutral-200/80 bg-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]";

  if (index === 0) {
    return `${base} col-span-2 aspect-[5/3]`;
  }

  return `${base} aspect-square`;
}

const INSTAGRAM_PROFILE_VIEW_HEIGHT = 360;
const INSTAGRAM_PROFILE_IFRAME_HEIGHT = 520;
const INSTAGRAM_POST_VIEW_HEIGHT = 280;
const INSTAGRAM_POST_IFRAME_HEIGHT = 380;

function InstagramEmbedFrame({
  embedUrl,
  title,
  variant = "post",
}: {
  embedUrl: string;
  title: string;
  variant?: "profile" | "post";
}) {
  const viewHeight =
    variant === "profile" ? INSTAGRAM_PROFILE_VIEW_HEIGHT : INSTAGRAM_POST_VIEW_HEIGHT;
  const iframeHeight =
    variant === "profile" ? INSTAGRAM_PROFILE_IFRAME_HEIGHT : INSTAGRAM_POST_IFRAME_HEIGHT;

  return (
    <div
      className="scrollbar-hide w-full overflow-x-hidden overflow-y-auto"
      style={{ height: viewHeight, WebkitOverflowScrolling: "touch" }}
    >
      <iframe
        src={embedUrl}
        title={title}
        className="w-full border-0"
        style={{ height: iframeHeight }}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

export function VitrinePortfolioGallery({
  items,
  title,
}: VitrinePortfolioGalleryProps) {
  if (items.length === 0) return null;

  const profileFeed = items.find((item) => item.type === "instagram_profile_embed");
  const gridItems = profileFeed ? [] : items;

  return (
    <section className="mt-6 px-4 sm:px-5" aria-labelledby="portfolio-gallery-heading">
      <h2
        id="portfolio-gallery-heading"
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {title}
      </h2>

      {profileFeed?.embedUrl ? (
        <div className={`${portfolioTileClass(0, true)} w-full`}>
          <InstagramEmbedFrame
            embedUrl={profileFeed.embedUrl}
            title={profileFeed.alt ?? "Publications Instagram"}
            variant="profile"
          />
        </div>
      ) : null}

      {gridItems.length > 0 ? (
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {gridItems.map((item, index) => (
            <li key={item.id} className={portfolioTileClass(index, false)}>
              {item.type === "instagram_embed" && item.embedUrl ? (
                <InstagramEmbedFrame
                  embedUrl={item.embedUrl}
                  title={item.alt ?? "Instagram"}
                  variant="post"
                />
              ) : item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
