type BlobPlacement = {
  gradientId: string;
  className: string;
};

const BLOB_PLACEMENTS: BlobPlacement[] = [
  {
    gradientId: "hero-blob-gradient-a",
    className:
      "left-[25%] top-[4%] h-24 w-24 -rotate-12 opacity-[0.6] sm:h-28 sm:w-28",
  },
  {
    gradientId: "hero-blob-gradient-b",
    className:
      "right-[25%] top-[14%] h-28 w-28 rotate-[25deg] opacity-[0.6] sm:h-33 sm:w-33",
  },
  {
    gradientId: "hero-blob-gradient-c",
    className:
      "bottom-[23%] left-[29%] h-20 w-20 rotate-6 opacity-[0.26] sm:h-24 sm:w-24",
  },
  {
    gradientId: "hero-blob-gradient-d",
    className:
      "bottom-[22%] right-[14%] h-26 w-26 -rotate-[8deg] opacity-[0.7] sm:h-40 sm:w-40",
  },
  {
    gradientId: "hero-blob-gradient-e",
    className:
      "bottom-[3%] right-[40%] h-26 w-26 -rotate-[8deg] opacity-[0.4] sm:h-20 sm:w-20",
  },
];

function HeroOrganicBlob({
  gradientId,
  className,
}: {
  gradientId: string;
  className: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#e8a08a" />
            <stop offset="100%" stopColor="#df896a" />
          </linearGradient>
        </defs>
        <path
          d="M453.5,283.5Q459,317,434.5,345Q410,373,382.5,402Q355,431,319,447.5Q283,464,247,457.5Q211,451,173.5,440Q136,429,108.5,401.5Q81,374,59,341Q37,308,36,269.5Q35,231,47,193Q59,155,88.5,126.5Q118,98,152,74Q186,50,227.5,42.5Q269,35,306,50Q343,65,377.5,86Q412,107,430.5,144.5Q449,182,449.5,216Q450,250,453.5,283.5Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
}

/** Formes organiques corail en fond du hero (petite taille). */
export function LandingHeroBlobs() {
  return (
    <div
      className="landing-hero-blobs pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {BLOB_PLACEMENTS.map((blob) => (
        <HeroOrganicBlob
          key={blob.gradientId}
          gradientId={blob.gradientId}
          className={blob.className}
        />
      ))}
    </div>
  );
}
