import { NextResponse } from "next/server";
import { checkPageSlugAvailability } from "@/lib/onboarding/pageSlugAvailability";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ available: false, code: "empty", normalized: "" });
  }

  let excludeUserId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    excludeUserId = user?.id;
  } catch {
    /* hors session */
  }

  const result = await checkPageSlugAvailability(slug, excludeUserId);

  return NextResponse.json({
    available: result.available,
    normalized: result.normalized,
    code: result.validation.code,
  });
}
