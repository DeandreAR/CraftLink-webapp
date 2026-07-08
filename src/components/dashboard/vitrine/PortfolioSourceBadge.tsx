import { FaFacebook, FaGoogle, FaInstagram, FaMobileScreen } from "react-icons/fa6";
import type { PortfolioSourceType } from "@/domain/portfolio";

type PortfolioSourceBadgeProps = {
  source: PortfolioSourceType;
  labelDirect?: string;
  className?: string;
};

const BADGE_CLASS =
  "inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm";

export function PortfolioSourceBadge({
  source,
  labelDirect = "Direct",
  className = "",
}: PortfolioSourceBadgeProps) {
  return (
    <span className={`${BADGE_CLASS} ${className}`.trim()}>
      {source === "instagram" ? (
        <>
          <FaInstagram className="h-3 w-3" aria-hidden />
          Instagram
        </>
      ) : null}
      {source === "facebook" ? (
        <>
          <FaFacebook className="h-3 w-3" aria-hidden />
          Facebook
        </>
      ) : null}
      {source === "google" ? (
        <>
          <FaGoogle className="h-3 w-3" aria-hidden />
          Google
        </>
      ) : null}
      {source === "direct" ? (
        <>
          <FaMobileScreen className="h-3 w-3" aria-hidden />
          {labelDirect}
        </>
      ) : null}
    </span>
  );
}
