import { NextResponse } from "next/server";
import { buildLeadsIcsFeed } from "@/lib/calendar/calendarFeed";
import { fetchLeadsByWorkspace } from "@/lib/leads/leadRepository";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Flux ICS public (token secret) — l’artisan s’abonne une fois dans Apple / Google / Outlook.
 * Les RDV planifiés apparaissent automatiquement quand le calendrier rafraîchit le flux.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token: rawToken } = await context.params;
  const token = rawToken?.trim();

  if (!token || token.length < 16) {
    return new NextResponse("Not found", { status: 404 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return new NextResponse("Service unavailable", { status: 503 });
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("workspace_id, full_name")
    .eq("calendar_feed_token", token)
    .maybeSingle();

  if (profileError || !profile?.workspace_id) {
    return new NextResponse("Not found", { status: 404 });
  }

  const leadsResult = await fetchLeadsByWorkspace(admin, profile.workspace_id as string);
  if (!leadsResult.ok) {
    return new NextResponse("Error loading events", { status: 500 });
  }

  const scheduled = leadsResult.leads.filter(
    (lead) => lead.schedule?.date && lead.workflowStatus !== "ARCHIVE",
  );

  const calName = profile.full_name
    ? `CraftLink — ${profile.full_name}`
    : "CraftLink Interventions";

  const ics = buildLeadsIcsFeed(scheduled, calName);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="craftlink-interventions.ics"',
      "Cache-Control": "private, max-age=300",
    },
  });
}
