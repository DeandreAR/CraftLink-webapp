import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateRedirectClient } from "@/components/affiliate/AffiliateRedirectClient";
import { resolvePublicAffiliateLink } from "@/lib/affiliate/resolvePublicAffiliateLink";
import { buildAffiliateSharePath } from "@/lib/onboarding/affiliateLinks";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";

type Props = {
  params: Promise<{ slug: string; linkId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, linkId } = await params;
  const resolved = await resolvePublicAffiliateLink(slug, linkId);
  if (!resolved) {
    return { title: "Lien introuvable — CraftLink", robots: { index: false } };
  }

  const title = resolved.link.discount
    ? `${resolved.link.label} (${resolved.link.discount}) — ${resolved.businessName}`
    : `${resolved.link.label} — ${resolved.businessName}`;
  const description = resolved.link.discount
    ? `${resolved.link.discount} via ${resolved.businessName}`
    : `Offre partenaire proposée par ${resolved.businessName}`;
  const path = buildAffiliateSharePath(resolved.pageSlug, resolved.link.id);

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: buildPageOpenGraph({
      title,
      description,
      path,
      imageUrl: resolved.previewImageUrl,
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(resolved.previewImageUrl ? { images: [resolved.previewImageUrl] } : {}),
    },
  };
}

export default async function AffiliateSharePage({ params }: Props) {
  const { slug, linkId } = await params;
  const resolved = await resolvePublicAffiliateLink(slug, linkId);
  if (!resolved) notFound();

  return (
    <AffiliateRedirectClient
      destinationUrl={resolved.destinationUrl}
      label={resolved.link.label}
      discount={resolved.link.discount}
      businessName={resolved.businessName}
      imageUrl={resolved.previewImageUrl}
    />
  );
}
