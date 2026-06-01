import type { VitrinePortfolioItem } from "@/domain/vitrine";

type VitrinePortfolioGalleryProps = {
  items: VitrinePortfolioItem[];
  title: string;
};

function portfolioTileClass(index: number): string {
  const base =
    "relative overflow-hidden rounded-[20px] border border-neutral-200/80 bg-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]";

  if (index === 0) {
    return `${base} col-span-2 aspect-[5/3]`;
  }

  return `${base} aspect-square`;
}

export function VitrinePortfolioGallery({
  items,
  title,
}: VitrinePortfolioGalleryProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6 px-4 sm:px-5" aria-labelledby="portfolio-gallery-heading">
      <h2
        id="portfolio-gallery-heading"
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {title}
      </h2>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <li key={item.id} className={portfolioTileClass(index)}>
            {item.type === "instagram_embed" && item.embedUrl ? (
              <iframe
                src={item.embedUrl}
                title={item.alt ?? "Instagram"}
                className="h-full min-h-[280px] w-full border-0 sm:min-h-[320px]"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
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
    </section>
  );
}
