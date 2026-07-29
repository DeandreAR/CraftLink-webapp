import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import {
  SiFacebook,
  SiInstagram,
  SiSnapchat,
  SiThreads,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import type { SocialLinkType, VitrineSocialLink } from "@/domain/vitrine";

const SOCIAL_ICONS: Partial<Record<SocialLinkType, IconType>> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  linkedin: FaLinkedinIn,
  tiktok: SiTiktok,
  threads: SiThreads,
  snapchat: SiSnapchat,
  youtube: SiYoutube,
  website: LuGlobe,
};

const VISIBLE_SOCIAL_TYPES: SocialLinkType[] = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "threads",
  "snapchat",
  "youtube",
  "website",
];

type VitrineSocialLinksProps = {
  links: VitrineSocialLink[];
  onDarkCover?: boolean;
};

export function VitrineSocialLinks({
  links,
  onDarkCover = false,
}: VitrineSocialLinksProps) {
  const visibleLinks = links.filter((link) =>
    VISIBLE_SOCIAL_TYPES.includes(link.type),
  );

  if (visibleLinks.length === 0) return null;

  const iconClass = onDarkCover
    ? "text-white transition hover:scale-110 hover:opacity-80"
    : "text-neutral-900 transition hover:scale-110 hover:opacity-70";
  const labelClass = onDarkCover
    ? "text-center text-[9px] font-medium leading-tight text-white/70"
    : "text-center text-[9px] font-medium leading-tight text-neutral-500";

  return (
    <ul className="flex flex-wrap items-start justify-center gap-5">
      {visibleLinks.map((link) => {
        const Icon = SOCIAL_ICONS[link.type];
        if (!Icon) return null;

        return (
          <li key={link.id} className="flex max-w-[5.5rem] flex-col items-center gap-1">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={iconClass}
              aria-label={link.label}
              title={link.label}
            >
              <Icon className="h-[1.35rem] w-[1.35rem]" aria-hidden />
            </a>
            {link.followerLabel ? (
              <span className={labelClass}>{link.followerLabel}</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
