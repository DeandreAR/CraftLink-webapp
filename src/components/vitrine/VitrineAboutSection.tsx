type VitrineAboutSectionProps = {
  title: string;
  body: string;
};

export function VitrineAboutSection({ title, body }: VitrineAboutSectionProps) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-neutral-300/90 bg-[#faf7f2] px-4 py-4 text-left">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </p>
      <p className="text-[13px] leading-relaxed text-neutral-700">{body}</p>
    </div>
  );
}
