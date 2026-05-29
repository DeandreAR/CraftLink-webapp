import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
} from "react-icons/si";
import type { SocialLinkType, VitrineSocialLink } from "@/domain/vitrine";

const SOCIAL_ICONS: Partial<Record<SocialLinkType, IconType>> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  linkedin: FaLinkedinIn,
  tiktok: SiTiktok,
  website: LuGlobe,
};

/** Réseaux affichés sous l’avatar (hors Google / WhatsApp). */
const VISIBLE_SOCIAL_TYPES: SocialLinkType[] = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "website",
];

type VitrineSocialLinksProps = {
  links: VitrineSocialLink[];
};

export function VitrineSocialLinks({ links }: VitrineSocialLinksProps) {
  const visibleLinks = links.filter((link) =>
    VISIBLE_SOCIAL_TYPES.includes(link.type),
  );

  if (visibleLinks.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center justify-center gap-4">
      {visibleLinks.map((link) => {
        const Icon = SOCIAL_ICONS[link.type];
        if (!Icon) return null;

        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 transition hover:scale-110 hover:opacity-70"
              aria-label={link.label}
              title={link.label}
            >
              <Icon className="h-[1.35rem] w-[1.35rem]" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
