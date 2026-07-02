import { LeadShareNotFound, LeadShareView } from "@/components/share/LeadShareView";
import { applyMediaRetention } from "@/lib/leads/applyMediaRetention";
import { getPublicLeadShare } from "@/services/leadShareService";

type ShareLeadPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
};

export async function generateMetadata({ params }: ShareLeadPageProps) {
  const { id } = await params;
  const share = await getPublicLeadShare(id);
  if (!share) {
    return { title: "Dossier introuvable — CraftLink" };
  }
  return {
    title: `${share.lead.workType} — ${share.businessName}`,
    robots: { index: false, follow: false },
  };
}

export default async function ShareLeadPage({ params, searchParams }: ShareLeadPageProps) {
  const { id } = await params;
  const { submitted } = await searchParams;
  const share = await getPublicLeadShare(id);

  if (!share) {
    return <LeadShareNotFound />;
  }

  const hadMedia = Boolean(
    share.lead.voice?.audioUrl ||
      (share.lead.photos?.length ?? 0) > 0 ||
      (share.lead.attachments?.length ?? 0) > 0,
  );
  const { lead, mediaExpired } = applyMediaRetention(share.lead, share.ownerPlan);

  return (
    <LeadShareView
      lead={lead}
      businessName={share.businessName}
      mediaExpired={mediaExpired}
      hadMedia={hadMedia}
      ownerPlan={share.ownerPlan}
      showSubmittedBanner={submitted === "1"}
    />
  );
}
