import Image, { type ImageProps } from "next/image";
import { isNextOptimizableImageUrl } from "@/lib/media/isNextOptimizableImageUrl";

type OptimizedRemoteImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * next/image avec fallback `unoptimized` pour les CDN hors allowlist
 * (Instagram, etc.) tout en gardant AVIF/WebP pour Supabase / local.
 */
export function OptimizedRemoteImage({
  src,
  alt,
  ...props
}: OptimizedRemoteImageProps) {
  const unoptimized =
    props.unoptimized === true || !isNextOptimizableImageUrl(src);

  return <Image src={src} alt={alt} {...props} unoptimized={unoptimized} />;
}
