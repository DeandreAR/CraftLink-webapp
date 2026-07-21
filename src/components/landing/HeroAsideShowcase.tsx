import Image from "next/image";
import { HiOutlineLink } from "react-icons/hi";
import { IoGridOutline, IoPersonCircleOutline } from "react-icons/io5";
import { SiInstagram } from "react-icons/si";

import type { HeroAsideShowcaseDictionary } from "@/i18n/types";

const HERO_PROFILE_SRC = "/images/hero/profil.jpeg";
const HERO_REALISATIONS = [
  "/images/hero/realisation-1.png",
  "/images/hero/realisation-2.png",
  "/images/hero/realisation-3.png",
] as const;

type HeroAsideShowcaseProps = {
  alt: string;
  copy: HeroAsideShowcaseDictionary;
  className?: string;
};

function ProfileAvatar({
  size,
  className = "",
}: {
  size: "sm" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? "h-[4.5rem] w-[4.5rem]" : "h-[4.25rem] w-[4.25rem]";
  const img = size === "lg" ? 72 : 68;

  return (
    <div
      className={`relative shrink-0 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[2px] ${dim} ${className}`.trim()}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
        <Image
          src={HERO_PROFILE_SRC}
          alt=""
          width={img}
          height={img}
          className="h-full w-full object-cover"
          sizes={`${img}px`}
        />
      </div>
    </div>
  );
}

function RealisationThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-neutral-100">
      <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
    </div>
  );
}

/** Maquette hero : Instagram → page CraftLink (effet 3D, URL getcraftlink.com). */
export function HeroAsideShowcase({ alt, copy, className = "" }: HeroAsideShowcaseProps) {
  return (
    <figure
      className={`landing-hero-aside-figure relative m-0 w-full ${className}`.trim()}
      aria-label={alt}
    >
      <p className="sr-only">{alt}</p>

      <div className="landing-hero-aside-stage mx-auto w-fit max-w-full [perspective:1400px]">
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-0 [transform-style:preserve-3d]">
          {/* Instagram — carte gauche, inclinée vers la droite */}
          <div
            className="relative z-10 w-[16.5rem] shrink-0 sm:w-[17rem] lg:w-[18rem] md:[transform:rotateY(20deg)_rotateX(3deg)_translateZ(0)] md:[transform-origin:center_right]"
          >
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
                <span className="text-[11px] font-bold text-neutral-900">{copy.instagramHandle}</span>
                <div className="flex items-center gap-2.5 text-neutral-800">
                  <span className="text-sm leading-none" aria-hidden>
                    +
                  </span>
                  <span className="text-[11px] leading-none" aria-hidden>
                    ≡
                  </span>
                </div>
              </div>

              <div className="px-3.5 pb-3 pt-3">
                <div className="flex items-center gap-4">
                  <ProfileAvatar size="sm" />
                  <dl className="grid flex-1 grid-cols-3 gap-1 text-center">
                    <div>
                      <dd className="text-[13px] font-bold text-neutral-900">{copy.posts}</dd>
                      <dt className="text-[9px] text-neutral-600">{copy.statPosts}</dt>
                    </div>
                    <div>
                      <dd className="text-[13px] font-bold text-neutral-900">{copy.followers}</dd>
                      <dt className="text-[9px] text-neutral-600">{copy.statFollowers}</dt>
                    </div>
                    <div>
                      <dd className="text-[13px] font-bold text-neutral-900">{copy.following}</dd>
                      <dt className="text-[9px] text-neutral-600">{copy.statFollowing}</dt>
                    </div>
                  </dl>
                </div>

                <div className="mt-2.5">
                  <p className="text-[11px] font-bold text-neutral-900">{copy.businessName}</p>
                  <p className="text-[10px] text-neutral-500">{copy.category}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-neutral-800">{copy.bioLine}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#00376b]">
                    <HiOutlineLink className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="truncate">{copy.linkInBio}</span>
                  </p>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <span className="rounded-lg bg-[#efefef] py-1.5 text-center text-[10px] font-semibold text-neutral-900">
                    {copy.follow}
                  </span>
                  <span className="rounded-lg bg-[#efefef] py-1.5 text-center text-[10px] font-semibold text-neutral-900">
                    {copy.ctaMessage}
                  </span>
                </div>

                <div className="mt-3 flex gap-3 overflow-x-auto pb-0.5">
                  {copy.highlightLabels.map((label, index) => (
                    <div key={label} className="flex shrink-0 flex-col items-center gap-1">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                        {index === 0 ? (
                          <Image
                            src={HERO_REALISATIONS[0]}
                            alt=""
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="max-w-[3rem] truncate text-[8px] text-neutral-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex border-t border-neutral-200">
                <span className="flex flex-1 items-center justify-center border-b-2 border-neutral-900 py-2 text-neutral-900">
                  <IoGridOutline className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex flex-1 items-center justify-center py-2 text-neutral-400">
                  <span className="text-[10px] font-semibold" aria-hidden>
                    {copy.reelsTab}
                  </span>
                </span>
                <span className="flex flex-1 items-center justify-center py-2 text-neutral-400">
                  <IoPersonCircleOutline className="h-4 w-4" aria-hidden />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-[2px] bg-neutral-100">
                {HERO_REALISATIONS.map((src, i) => (
                  <RealisationThumb key={src} src={src} alt={`${copy.portfolioTitle} ${i + 1}`} />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#EFA188]/30 bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#c45c3e] shadow-sm">
              <SiInstagram className="h-3 w-3 text-[#E4405F]" aria-hidden />
              {copy.flowLabel}
            </div>
          </div>

          {/* CraftLink — carte droite, inclinée vers la gauche, par-dessus */}
          <div
            className="relative z-20 w-[15.5rem] shrink-0 sm:w-[16.5rem] lg:w-[17rem] md:-ml-[3.75rem] lg:-ml-[4.5rem] md:[transform:rotateY(-20deg)_rotateX(3deg)_translateZ(36px)] md:[transform-origin:center_left]"
          >
            <div className="mb-2 flex justify-center">
              <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-[0_12px_32px_rgba(33,33,41,0.12)]">
                <span className="text-[10px] text-neutral-400" aria-hidden>
                  🔒
                </span>
                <span className="truncate font-mono text-[10px] font-semibold text-neutral-800 sm:text-[11px]">
                  {copy.url}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <div
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, #EFA188 35%, white) 0%, color-mix(in srgb, #EFA188 8%, white) 100%)",
                }}
              />
              <div className="relative px-4 pb-4 pt-0">
                <div className="-mt-8 flex justify-center">
                  <ProfileAvatar size="lg" className="shadow-md" />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-base font-extrabold tracking-tight text-neutral-900">
                    {copy.businessName}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-neutral-600">{copy.trade}</p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="rounded-full bg-neutral-900 py-2.5 text-center text-[11px] font-bold text-white">
                    {copy.ctaQuote}
                  </div>
                  <div className="rounded-full border-2 border-neutral-900 py-2 text-center text-[11px] font-bold text-neutral-900">
                    {copy.ctaServices}
                  </div>
                </div>

                <div className="mt-3 flex justify-center gap-3">
                  <SiInstagram className="h-4 w-4 text-neutral-800" aria-hidden />
                  <span className="text-[9px] font-medium text-neutral-500">
                    {copy.followersOnPage}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                    {copy.portfolioTitle}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {HERO_REALISATIONS.map((src, i) => (
                      <div
                        key={src}
                        className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
                      >
                        <Image
                          src={src}
                          alt={`${copy.portfolioTitle} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(100%,24rem)] w-[min(100%,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EFA188]/14 blur-3xl"
      />
    </figure>
  );
}
