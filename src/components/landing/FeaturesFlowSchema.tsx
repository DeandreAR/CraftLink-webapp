import type { FeaturesFlowDictionary } from "@/i18n/types";
import { IconMic, IconMessage } from "@/components/landing/Icons";
import { LuFolder, LuQrCode } from "react-icons/lu";
import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
} from "react-icons/si";

type FeaturesFlowSchemaProps = {
  flow: FeaturesFlowDictionary;
  className?: string;
};

const BRAND_ICON = "h-7 w-7 shrink-0";
const UTILITY_ICON = "h-7 w-7 shrink-0 text-white/85";
const ACTION_ICON = "h-9 w-9 shrink-0";

function IconSmsBadge({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-md border border-white/30 bg-white/10 text-[9px] font-extrabold tracking-tight text-white ${className}`.trim()}
      aria-hidden
    >
      SMS
    </span>
  );
}

function FlowArrow({
  hint,
  className = "",
}: {
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center gap-1 self-center ${className}`.trim()}
      aria-hidden
    >
      <svg viewBox="0 0 40 16" fill="none" className="h-4 w-10 text-white/50">
        <path
          d="M0 8h32m0 0-4-4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="whitespace-nowrap rounded-full border border-[#EFA188]/40 bg-[#EFA188]/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#EFA188]">
        {hint}
      </span>
    </div>
  );
}

function FunnelArrows() {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden
      className="absolute -right-1 top-1/2 h-14 w-12 -translate-y-1/2 text-white/40"
    >
      <path
        d="M4 8C18 14 28 20 40 28M4 28C18 32 28 36 40 40M4 48C18 42 28 38 40 32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PANEL =
  "rounded-xl border border-white/10 bg-white/[0.03]";
const STEP_LABEL =
  "text-[10px] font-bold uppercase tracking-[0.14em] text-white/70";

export function FeaturesFlowSchema({ flow, className = "" }: FeaturesFlowSchemaProps) {
  return (
    <figure
      className={`landing-features-flow mt-8 ${className}`.trim()}
      aria-label={flow.figureAlt}
    >
      <div className="overflow-x-auto rounded-[1.5rem] border border-neutral-800/20 bg-neutral-950 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] md:p-6">
        <div className="flex min-w-[52rem] items-stretch gap-2 md:gap-3">
          {/* 1 — Sources */}
          <div className="flex w-[11.5rem] shrink-0 flex-col">
            <p className={STEP_LABEL}>{flow.step1.label}</p>
            <div className={`relative mt-3 flex flex-1 items-center justify-center px-3 py-5 ${PANEL}`}>
              <div className="grid grid-cols-3 gap-3">
                <SiInstagram className={`${BRAND_ICON} text-[#E4405F]`} aria-hidden />
                <SiFacebook className={`${BRAND_ICON} text-[#1877F2]`} aria-hidden />
                <SiTiktok className={`${BRAND_ICON} text-white`} aria-hidden />
                <SiGmail className={BRAND_ICON} aria-hidden />
                <LuQrCode className={UTILITY_ICON} strokeWidth={1.75} aria-hidden />
                <IconSmsBadge />
              </div>
              <FunnelArrows />
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[0]} />

          {/* 2 — Lien central */}
          <div className="flex w-[10.5rem] shrink-0 flex-col">
            <p className={STEP_LABEL}>{flow.step2.label}</p>
            <div className={`mt-3 flex flex-1 flex-col items-center justify-center px-3 py-4 ${PANEL}`}>
              <div className="w-[5.5rem] rounded-[1.1rem] border-2 border-white/60 p-1.5">
                <div className="rounded-lg border border-white/20 bg-neutral-900 px-1.5 py-2">
                  <p className="text-center text-[8px] font-bold tracking-wide text-white">
                    {flow.step2.bioLink}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    <div className="flex flex-col items-center gap-0.5 rounded border border-white/25 bg-white/5 px-1 py-1.5">
                      <IconMic className="h-3 w-3 text-white" />
                      <span className="text-[6px] font-bold text-white/90">
                        {flow.step2.vocal}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 rounded border border-white/25 bg-white/5 px-1 py-1.5">
                      <IconMessage className="h-3 w-3 text-white" />
                      <span className="text-[6px] font-bold text-white/90">
                        {flow.step2.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[1]} />

          {/* 3 — Contacts */}
          <div className="flex min-w-0 flex-1 flex-col">
            <p className={STEP_LABEL}>{flow.step3.label}</p>
            <div className={`mt-3 flex flex-1 flex-col overflow-hidden ${PANEL}`}>
              <div className="flex items-center justify-between border-b border-white/10 px-2.5 py-1.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-white">
                  {flow.step3.contactsTitle}
                </span>
                <span className="rounded border border-white/20 px-1.5 py-0.5 text-[6px] font-semibold text-white/70">
                  {flow.step3.addContact}
                </span>
              </div>
              <table className="w-full text-left text-[6px] text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="px-2 py-1 font-semibold">{flow.step3.colName}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colPhone}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colSource}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colLast}</th>
                  </tr>
                </thead>
                <tbody>
                  {flow.contactRows.map((row) => (
                    <tr key={row.name} className="border-b border-white/5">
                      <td className="px-2 py-0.5 font-medium text-white">{row.name}</td>
                      <td className="px-1 py-0.5 whitespace-nowrap">{row.phone}</td>
                      <td className="px-1 py-0.5">{row.source}</td>
                      <td className="px-1 py-0.5 text-white/50">{row.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto border-t border-white/10 px-2 py-1 text-[6px] text-white/40">
                {flow.step3.pagination}
              </p>
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[2]} />

          {/* 4 — Action : WhatsApp, SMS, dossier */}
          <div className="flex w-[9.5rem] shrink-0 flex-col">
            <p className={STEP_LABEL}>{flow.step4.label}</p>
            <div className={`mt-3 flex flex-1 items-center justify-center gap-4 px-3 py-4 ${PANEL}`}>
              <SiWhatsapp className={`${ACTION_ICON} text-[#25D366]`} aria-hidden />
              <IconSmsBadge className="h-9 w-9 min-w-[2.25rem] text-[10px]" />
              <span
                title={flow.step4.folder}
                className="flex flex-col items-center gap-0.5"
              >
                <LuFolder
                  className={`${ACTION_ICON} text-white/90`}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="text-[6px] font-bold uppercase tracking-wide text-white/55">
                  {flow.step4.folder}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{flow.figureAlt}</figcaption>
    </figure>
  );
}
