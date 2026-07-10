type VitrineInterventionTagsProps = {
  items: string[];
};

export function VitrineInterventionTags({ items }: VitrineInterventionTagsProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-neutral-300/90 bg-[#faf7f2] px-3 py-3.5">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        Interventions
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-[#e5ddd0] bg-white px-3 py-1.5 text-[12px] font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
