import Image from "next/image";

type VitrineFooterProps = {
  label?: string;
};

export function VitrineFooter({ label }: VitrineFooterProps) {
  return (
    <footer className="flex flex-col items-center gap-2 pb-8 pt-4 opacity-10">
      <Image
        src="/images/logo_main.png"
        alt="CraftLink"
        width={88}
        height={24}
        className="h-5 w-auto grayscale"
      />
      {label ? (
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-900">
          {label}
        </p>
      ) : null}
    </footer>
  );
}
