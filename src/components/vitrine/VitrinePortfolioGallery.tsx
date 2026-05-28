import type { VitrinePortfolioItem } from "@/domain/vitrine";

type VitrinePortfolioGalleryProps = {
  items: VitrinePortfolioItem[];
  title: string;
};

export function VitrinePortfolioGallery({
  items,
  title,
}: VitrinePortfolioGalleryProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6 px-4 sm:px-5">
      <h2 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </h2>
      <ul className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm"
          >
            {item.type === "instagram_embed" && item.embedUrl ? (
              <iframe
                src={item.embedUrl}
                title={item.alt ?? "Instagram"}
                className="h-full w-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.alt ?? ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
