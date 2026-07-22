import type { VitrineAffiliateLink } from "@/domain/vitrine";

type VitrineAffiliateLinksProps = {
  links: VitrineAffiliateLink[];
  title: string;
};

export function VitrineAffiliateLinks({ links, title }: VitrineAffiliateLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="mt-6 text-left">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:border-[#EFA188]/50 hover:bg-[#EFA188]/5"
            >
              {link.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={link.imageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover bg-neutral-100"
                />
              ) : null}
              <span className="min-w-0 flex-1">{link.label}</span>
              <span className="flex shrink-0 items-center gap-2">
                {link.discount ? (
                  <span className="rounded-full bg-[#EFA188]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#c45a3a]">
                    {link.discount}
                  </span>
                ) : null}
                <span className="text-xs font-bold text-[#EFA188]" aria-hidden>
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
