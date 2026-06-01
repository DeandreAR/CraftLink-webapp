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

function BannerCollage({
  collage,
  bannerUrl,
  bannerGradient,
}: {
  collage?: [string | null, string | null, string | null];
  bannerUrl?: string | null;
  bannerGradient?: { from: string; to: string } | null;
}) {
  if (bannerGradient) {
    return (
      <div
        className="h-44 w-full sm:h-48"
        style={{
          background: `linear-gradient(135deg, ${bannerGradient.from} 0%, ${bannerGradient.to} 100%)`,
        }}
        role="img"
        aria-label="Bannière"
      />
    );
  }

  if (bannerUrl) {
    return (
      <div
        className="h-44 w-full bg-cover bg-[center_22%] sm:h-48"
        style={{ backgroundImage: `url(${bannerUrl})` }}
        role="img"
        aria-label="Bannière"
      />
    );
  }

  const tiles = collage ?? [null, null, null];

  return (
    <div className="grid h-44 grid-cols-2 grid-rows-2 gap-0.5 sm:h-48" role="img" aria-label="Bannière">
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

export function VitrineProfileHero({
  artisan,
  showSocialLinks,
}: VitrineProfileHeroProps) {
  const { media } = artisan;
  const showAvatar = media.showAvatar;

  return (
    <div className="relative overflow-hidden bg-[var(--bg-color)]">
      <BannerCollage
        collage={media.bannerCollage}
        bannerUrl={media.bannerUrl ?? undefined}
        bannerGradient={media.bannerGradient ?? undefined}
      />

      {showAvatar ? (
        <div className="relative z-10 -mt-14 flex flex-col items-center px-4 pb-1">
          {media.avatarUrl ? (
            <img
              src={media.avatarUrl}
              alt=""
              className="h-[7.25rem] w-[7.25rem] rounded-full border-[5px] border-white object-cover object-[center_18%] shadow-[0_14px_36px_rgba(15,23,42,0.2)]"
            />
          ) : (
            <div
              className="flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-full border-[5px] border-white bg-[var(--primary-color)] text-2xl font-bold text-white shadow-[0_14px_36px_rgba(15,23,42,0.2)]"
              aria-hidden
            >
              {artisan.avatarInitials}
            </div>
          )}

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
