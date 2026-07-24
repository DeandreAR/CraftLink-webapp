import type { ArtisanVitrineProfile } from "@/domain/vitrine";
import { normalizeHeaderLayoutType } from "@/domain/recommendedProduct";
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
      <div
        className={`w-full bg-cover bg-[center_22%] ${heightClass}`}
        style={{ backgroundImage: `url(${media.bannerUrl})` }}
        role="img"
        aria-label="Bannière"
      />
    );
  }

  const tiles = media.bannerCollage ?? [null, null, null];

  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 gap-0.5 ${heightClass}`}
      role="img"
      aria-label="Bannière"
    >
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: tiles[0] ? `url(${tiles[0]})` : COLLAGE_PLACEHOLDERS[0],
        }}
      />
      <div
        className="row-span-2 bg-cover bg-center"
        style={{
          backgroundImage: tiles[2] ? `url(${tiles[2]})` : COLLAGE_PLACEHOLDERS[2],
        }}
      />
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: tiles[1] ? `url(${tiles[1]})` : COLLAGE_PLACEHOLDERS[1],
        }}
      />
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
    ? "border-[5px] border-white shadow-[0_14px_36px_rgba(15,23,42,0.2)]"
    : "border-0 shadow-[0_10px_28px_rgba(15,23,42,0.18)]";

  if (media.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.avatarUrl}
        alt=""
        className={`h-[7.25rem] w-[7.25rem] rounded-full object-cover object-[center_18%] ${borderClass}`}
      />
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

  // Pleine page : le fond est sur le shell — ici uniquement photo / nom.
  if (layout === "avatar_cover") {
    return (
      <div className="relative z-10 flex flex-col items-center px-4 pb-2 pt-8">
        <AvatarBlock artisan={artisan} withBorder={withBorder} />
        {showSocialLinks ? (
          <div className="mt-4 w-full">
            <VitrineSocialLinks links={artisan.socialLinks} />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "page_brand") {
    return (
      <div className="relative z-10 flex flex-col items-center px-5 pb-4 pt-10 text-center">
        <p
          className={`text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-[2rem] ${
            light ? "text-neutral-900" : "text-white drop-shadow-sm"
          }`}
        >
          {artisan.businessName}
        </p>
        {artisan.tradeLabel ? (
          <p
            className={`mt-2 text-sm font-medium ${
              light ? "text-neutral-700" : "text-white/90"
            }`}
          >
            {artisan.tradeLabel}
            {artisan.city ? ` · ${artisan.city}` : ""}
          </p>
        ) : null}
        {showSocialLinks ? (
          <div className="mt-5 w-full">
            <VitrineSocialLinks links={artisan.socialLinks} />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "brand_cover") {
    return (
      <div className="relative overflow-hidden">
        <div
          className="flex min-h-[11.5rem] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[13rem]"
          style={resolveVitrineCoverStyle(media)}
        >
          <p
            className={`text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-[2rem] ${
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
