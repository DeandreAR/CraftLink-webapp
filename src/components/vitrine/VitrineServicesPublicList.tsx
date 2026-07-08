import type { VitrineService } from "@/domain/vitrine";
import {
  getServicesItemClass,
  getServicesListLayoutClass,
} from "@/lib/vitrine/servicesDisplay";

type VitrineServicesPublicListProps = {
  services: VitrineService[];
  title: string;
  surDevisLabel: string;
};

export function VitrineServicesPublicList({
  services,
  title,
  surDevisLabel,
}: VitrineServicesPublicListProps) {
  if (services.length === 0) return null;

  const count = services.length;
  const listClass = getServicesListLayoutClass(count);
  const itemClass = getServicesItemClass(count);

  return (
    <section className="mt-5 px-4 sm:px-5" aria-labelledby="vitrine-services-heading">
      <h2
        id="vitrine-services-heading"
        className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500"
      >
        {title}
      </h2>
      <ul className={listClass}>
        {services.map((service) => (
          <li key={service.id} className={itemClass}>
            <p className="text-sm font-semibold leading-snug text-[var(--v-text)]">{service.title}</p>
            <p className="mt-0.5 text-xs font-bold text-[var(--primary-color)]">
              {service.priceHtLabel || surDevisLabel}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
