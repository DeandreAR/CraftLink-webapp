import type { ArtisanVitrineProfile } from "@/domain/vitrine";
import { normalizeHeaderLayoutType } from "@/domain/recommendedProduct";
import { OptimizedRemoteImage } from "@/components/media/OptimizedRemoteImage";
import {
  isFullPageBackgroundLayout,
  isLightVitrineCover,
  resolveVitrineCoverStyle,
} from "@/lib/vitrine/vitrineCoverStyle";
import { VitrineSocialLinks } from "@/components/vitrine/VitrineSocialLinks";

type VitrineProfileHeroProps = {
  artisan: ArtisanVitrineProfile;
  showSocialLinks: boolean;
};

const COLLAGE_PLACEHOLDERS: [string, string, string] = [
  "linear-gradient(135deg, #d6d3d1 0%, #a8a29e 100%)",
  "linear-gradient(135deg, #57534e 0%, #292524 100%)",
  "linear-gradient(135deg, #78716c 0%, #44403c 100%)",
];

function HeaderBackground({
  media,
  heightClass,
}: {
  media: ArtisanVitrineProfile["media"];
  heightClass: string;
}) {
  if (
    media.headerBgType === "solid" ||
    (!media.bannerUrl && !media.bannerGradient && media.headerSolidColor)
  ) {
    return (
      <div
        className={`w-full ${heightClass}`}
        style={{ backgroundColor: media.headerSolidColor || "#FFFFFF" }}
        role="img"
        aria-label="Bannière"
      />
    );
  }

  if (media.bannerGradient) {
    return (
      <div
        className={`w-full ${heightClass}`}
        style={{
          background: `linear-gradient(135deg, ${media.bannerGradient.from} 0%, ${media.bannerGradient.to} 100%)`,
        }}
        role="img"
        aria-label="Bannière"
      />
    );
  }

  if (media.bannerUrl) {
    return (
      <div className={`relative w-full overflow-hidden ${heightClass}`} role="img" aria-label="Bannière">
        <OptimizedRemoteImage
          src={media.bannerUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover object-[center_22%]"
        />
      </div>
    );
  }

  const tiles = media.bannerCollage ?? [null, null, null];
  const collageSlots: Array<{ index: 0 | 1 | 2; spanClass: string }> = [
    { index: 0, spanClass: "" },
    { index: 2, spanClass: "row-span-2" },
    { index: 1, spanClass: "" },
  ];

  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 gap-0.5 ${heightClass}`}
      role="img"
      aria-label="Bannière"
    >
      {collageSlots.map(({ index, spanClass }) => {
        const src = tiles[index];
        if (src) {
          return (
            <div key={index} className={`relative overflow-hidden ${spanClass}`}>
              <OptimizedRemoteImage
                src={src}
                alt=""
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(max-width: 768px) 50vw, 224px"
                className="object-cover object-center"
              />
            </div>
          );
        }
        return (
          <div
            key={index}
            className={`bg-cover bg-center ${spanClass}`}
            style={{ backgroundImage: COLLAGE_PLACEHOLDERS[index] }}
          />
        );
      })}
    </div>
  );
}

function AvatarBlock({
  artisan,
  withBorder,
}: {
  artisan: ArtisanVitrineProfile;
  withBorder: boolean;
}) {
  const { media } = artisan;
  const borderClass = withBorder
    ? "border-[3px] border-white shadow-none"
    : "border-0 shadow-none";

  if (media.avatarUrl) {
    return (
      <div
        className={`relative h-[7.25rem] w-[7.25rem] overflow-hidden rounded-full ${borderClass}`}
      >
        <OptimizedRemoteImage
          src={media.avatarUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="116px"
          className="object-cover object-[center_18%]"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-full bg-[var(--primary-color)] text-2xl font-bold text-white ${borderClass}`}
      aria-hidden
    >
      {artisan.avatarInitials}
    </div>
  );
}

export function VitrineProfileHero({
  artisan,
  showSocialLinks,
}: VitrineProfileHeroProps) {
  const { media } = artisan;
  const layout = normalizeHeaderLayoutType(media.headerLayoutType);
  const withBorder = media.headerAvatarBorder !== false;
  const light = isLightVitrineCover(media);
  const fullPage = isFullPageBackgroundLayout(layout);
  const onDarkCover = fullPage && !light;

  // Pleine page : le fond est sur le shell — ici uniquement photo / nom.
  if (layout === "avatar_cover") {
    return (
      <div className="relative z-10 flex flex-col items-center px-4 pb-2 pt-8">
        <AvatarBlock artisan={artisan} withBorder={withBorder} />
        {showSocialLinks ? (
          <div className="mt-4 w-full">
            <VitrineSocialLinks links={artisan.socialLinks} onDarkCover={onDarkCover} />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "page_brand") {
    return (
      <div className="relative z-10 flex flex-col items-center px-5 pb-4 pt-10 text-center">
        <p
          className={`text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-[2.05rem] ${
            light ? "text-neutral-900" : "text-white drop-shadow-sm"
          }`}
        >
          {artisan.businessName}
        </p>
        {artisan.tradeLabel ? (
          <p
            className={`mt-2.5 text-[13px] font-medium leading-relaxed tracking-[-0.01em] ${
              light ? "text-neutral-600" : "text-white/85"
            }`}
          >
            {artisan.tradeLabel}
            {artisan.city ? ` · ${artisan.city}` : ""}
          </p>
        ) : null}
        {showSocialLinks ? (
          <div className="mt-5 w-full">
            <VitrineSocialLinks links={artisan.socialLinks} onDarkCover={onDarkCover} />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "brand_cover") {
    const coverHasImage = Boolean(media.bannerUrl);
    return (
      <div className="relative overflow-hidden">
        <div
          className="relative flex min-h-[11.5rem] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[13rem]"
          style={coverHasImage ? undefined : resolveVitrineCoverStyle(media)}
        >
          {coverHasImage && media.bannerUrl ? (
            <OptimizedRemoteImage
              src={media.bannerUrl}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover object-center"
            />
          ) : null}
          <div className="relative z-10">
            <p
              className={`text-[1.75rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[2rem] ${
                light ? "text-neutral-900" : "text-white"
              }`}
            >
              {artisan.businessName}
            </p>
            {artisan.tradeLabel ? (
              <p
                className={`mt-2 text-sm font-medium ${
                  light ? "text-neutral-700" : "text-white/85"
                }`}
              >
                {artisan.tradeLabel}
                {artisan.city ? ` · ${artisan.city}` : ""}
              </p>
            ) : null}
          </div>
        </div>
        {showSocialLinks ? (
          <div className="bg-white px-4 py-4">
            <VitrineSocialLinks links={artisan.socialLinks} />
          </div>
        ) : null}
      </div>
    );
  }

  // banner_overlay
  return (
    <div className={`relative overflow-hidden ${fullPage ? "" : "bg-[var(--bg-color)]"}`}>
      <HeaderBackground media={media} heightClass="h-44 sm:h-48" />

      <div className="relative z-10 -mt-14 flex flex-col items-center px-4 pb-1">
        <AvatarBlock artisan={artisan} withBorder={withBorder} />
        {showSocialLinks ? (
          <div className="mt-4 w-full">
            <VitrineSocialLinks links={artisan.socialLinks} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
