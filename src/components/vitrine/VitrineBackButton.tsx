import { LuChevronLeft } from "react-icons/lu";

type VitrineBackButtonProps = {
  label: string;
  onClick: () => void;
};

export function VitrineBackButton({ label, onClick }: VitrineBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:border-neutral-400 hover:bg-neutral-50 active:scale-95"
    >
      <LuChevronLeft className="h-5 w-5 text-neutral-700" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
