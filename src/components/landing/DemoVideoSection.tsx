import type { DemoVideoDictionary } from "@/i18n/types";

type DemoVideoSectionProps = {
  copy: DemoVideoDictionary;
};

export function DemoVideoSection({ copy }: DemoVideoSectionProps) {
  return (
    <section
      id={copy.sectionId}
      className="landing-demo-video scroll-mt-28 border-t border-neutral-200 bg-white py-14 md:py-18"
      aria-labelledby="demo-video-heading"
    >
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <h2
          id="demo-video-heading"
          className="text-2xl font-bold tracking-tight text-black md:text-3xl"
        >
          {copy.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
          {copy.subtitle}
        </p>
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-[#EFA188]/10 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
          <div className="relative aspect-video w-full overflow-hidden rounded-[1.35rem] border border-neutral-200/80 bg-neutral-900">
            {copy.videoSrc ? (
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={copy.posterSrc}
              >
                <source src={copy.videoSrc} type="video/mp4" />
              </video>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                </span>
                <p className="text-sm font-medium text-white/90 md:text-base">
                  {copy.placeholder}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
