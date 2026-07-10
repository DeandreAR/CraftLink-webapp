import { NextResponse } from "next/server";
import { getImportAuthContext } from "@/lib/onboarding/proImport/api/importAuth";
import {
  magicImportRemaining,
  MAX_MAGIC_IMPORT_SUCCESS,
  readMagicImportSuccessCount,
} from "@/lib/onboarding/proImport/api/magicImportQuota";

export async function GET() {
  const auth = await getImportAuthContext();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const used = readMagicImportSuccessCount(auth.vitrinePresentation);
  return NextResponse.json({
    used,
    remaining: magicImportRemaining(auth.vitrinePresentation),
    max: MAX_MAGIC_IMPORT_SUCCESS,
  });
}
