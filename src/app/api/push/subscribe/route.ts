import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidPushSubscription } from "@/lib/push/pushSubscription";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
    }

    const body = (await request.json()) as { subscription?: unknown };
    if (!isValidPushSubscription(body.subscription)) {
      return NextResponse.json(
        { error: "Abonnement Push invalide." },
        { status: 400 },
      );
    }

    const subscription = body.subscription;
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        subscription_json: subscription,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { endpoint?: string };
    const endpoint = body.endpoint?.trim();

    let query = supabase.from("push_subscriptions").delete().eq("user_id", user.id);
    if (endpoint) {
      query = query.eq("endpoint", endpoint);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
