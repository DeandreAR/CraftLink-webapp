import { NextResponse } from "next/server";
import { runTrialEmailCron } from "@/lib/trial/runTrialEmailCron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

/** Vercel Cron — séquence e-mails essai Pro (J+7, J+12, expiration J+14). */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runTrialEmailCron();

  if (!result.ok) {
    console.error("[trial-cron]", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stats: result.stats });
}
