import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/** Charte CraftLink — version Instagram (minimal, fond blanc, CTA noir) */
const COLORS = {
  bg: "#FFFFFF",
  ink: "#212129",
  muted: "#5b6478",
  peach: "#EFA188",
  border: "rgba(33, 33, 41, 0.1)",
} as const;

const DEFAULTS = {
  name: "M. Martin",
  job: "Électricien",
  text: "Je viens de passer 45 minutes à chercher les photos du chantier dans mes SMS… pour me rendre compte que le client les avait envoyées sur WhatsApp dimanche à 7h.",
} as const;

function readParam(
  searchParams: URLSearchParams,
  key: keyof typeof DEFAULTS,
  maxLen: number,
): string {
  const raw = searchParams.get(key);
  const value = (raw?.trim() || DEFAULTS[key]).slice(0, maxLen);
  return value.length > 0 ? value : DEFAULTS[key];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = readParam(searchParams, "name", 48);
    const job = readParam(searchParams, "job", 48);
    const text = readParam(searchParams, "text", 280);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: COLORS.bg,
            padding: "72px",
            position: "relative",
          }}
        >
          {/* Marque — coin supérieur gauche */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              top: "64px",
              left: "72px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                fontWeight: 700,
                color: COLORS.ink,
                letterSpacing: "-0.04em",
              }}
            >
              CraftLink.
            </div>
            <div
              style={{
                display: "flex",
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: COLORS.peach,
                marginLeft: "8px",
              }}
            />
          </div>

          {/* Bloc citation central */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
              paddingTop: "48px",
              paddingBottom: "48px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "28px",
                border: `1px solid ${COLORS.border}`,
                padding: "56px 52px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                  marginBottom: "28px",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: COLORS.ink,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: COLORS.muted,
                  }}
                >
                  {`· ${job}`}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "40px",
                  height: "2px",
                  backgroundColor: COLORS.ink,
                  marginBottom: "28px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  fontSize: "38px",
                  fontWeight: 700,
                  color: COLORS.ink,
                  lineHeight: 1.35,
                  letterSpacing: "-0.02em",
                }}
              >
                {`“${text}”`}
              </div>
            </div>
          </div>

          {/* CTA noir — coin inférieur droit */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "64px",
              right: "72px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.ink,
                color: "#FFFFFF",
                padding: "16px 28px",
                borderRadius: "9999px",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Centraliser mes demandes ↗
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      },
    );
  } catch (error) {
    console.error("[api/og-image]", error);
    return new Response("Génération de l’image échouée", { status: 500 });
  }
}
