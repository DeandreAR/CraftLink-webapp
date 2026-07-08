import type { DemoVideoDictionary } from "@/i18n/types";

type DemoVideoSectionProps = {
  copy: DemoVideoDictionary;
};

export function DemoVideoSection({ copy }: DemoVideoSectionProps) {
  return (
    <section
      id={copy.sectionId}
      className="landing-demo-video lk-section-alt scroll-mt-28"
      aria-labelledby="demo-video-heading"
    >
      <div className="mx-auto max-w-4xl px-4 py-14 text-center md:px-6 md:py-16">
        <span className="lk-eyebrow">{copy.eyebrow}</span>
        <h2 id="demo-video-heading" className="lk-display mt-5 text-3xl md:text-4xl">
          {copy.title}
        </h2>
        <p className="lk-lead mx-auto mt-3 max-w-2xl text-base md:text-lg">{copy.subtitle}</p>
        <div className="mt-10 overflow-hidden rounded-[1.5rem] border-2 border-[#EFA188]/40 bg-gradient-to-br from-[#EFA188]/15 via-white to-[#D6BCFA]/10 p-2 shadow-[0_20px_56px_rgba(239,161,136,0.15)]">
          <div className="relative aspect-video w-full overflow-hidden rounded-[1.15rem] border-2 border-[#212129]/10 bg-[#212129]">
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
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFA188] text-[#212129] ring-4 ring-white/20"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-white/90 md:text-base">{copy.placeholder}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
