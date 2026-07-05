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
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:border-[#EFA188]/50 hover:bg-[#EFA188]/5"
            >
              <span>{link.label}</span>
              <span className="shrink-0 text-xs font-bold text-[#EFA188]" aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
