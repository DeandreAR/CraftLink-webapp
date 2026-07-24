import type { ArtisanVitrineProfile } from "@/domain/vitrine";
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
}: {
  media: ArtisanVitrineProfile["media"];
}) {
  const bgType = media.headerBgType;
  const heightClass =
    media.headerLayoutType === "standard" ? "h-28 sm:h-32" : "h-44 sm:h-48";

  if (bgType === "solid" || (!media.bannerUrl && !media.bannerGradient && media.headerSolidColor)) {
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

function AvatarBlock({ artisan }: { artisan: ArtisanVitrineProfile }) {
  const { media } = artisan;
  if (media.avatarUrl) {
    return (
      <img
        src={media.avatarUrl}
        alt=""
        className="h-[7.25rem] w-[7.25rem] rounded-full border-[5px] border-white object-cover object-[center_18%] shadow-[0_14px_36px_rgba(15,23,42,0.2)]"
      />
    );
  }

  return (
    <div
      className="flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-full border-[5px] border-white bg-[var(--primary-color)] text-2xl font-bold text-white shadow-[0_14px_36px_rgba(15,23,42,0.2)]"
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
  const layout = media.headerLayoutType ?? "banner_overlay";
  const showAvatar = media.showAvatar;

  if (layout === "standard") {
    return (
      <div className="relative overflow-hidden bg-[var(--bg-color)]">
        <HeaderBackground media={media} />
        <div className="relative z-10 flex flex-col items-center px-4 pb-2 pt-4">
          {showAvatar ? <AvatarBlock artisan={artisan} /> : null}
          {showSocialLinks ? (
            <div className={`w-full ${showAvatar ? "mt-4" : ""}`}>
              <VitrineSocialLinks links={artisan.socialLinks} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[var(--bg-color)]">
      <HeaderBackground media={media} />

      {showAvatar ? (
        <div className="relative z-10 -mt-14 flex flex-col items-center px-4 pb-1">
          <AvatarBlock artisan={artisan} />
          {showSocialLinks ? (
            <div className="mt-4 w-full">
              <VitrineSocialLinks links={artisan.socialLinks} />
            </div>
          ) : null}
        </div>
      ) : showSocialLinks ? (
        <div className="px-4 py-4">
          <VitrineSocialLinks links={artisan.socialLinks} />
        </div>
      ) : null}
    </div>
  );
}
