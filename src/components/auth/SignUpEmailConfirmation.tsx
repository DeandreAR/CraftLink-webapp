import Link from "next/link";
import type { AuthSignUpDictionary } from "@/i18n/types";

type SignUpEmailConfirmationProps = {
  copy: AuthSignUpDictionary;
  email: string;
  loginHref: string;
};

export function SignUpEmailConfirmation({
  copy,
  email,
  loginHref,
}: SignUpEmailConfirmationProps) {
  return (
    <div
      className="rounded-[24px] border border-[#EFA188]/35 bg-[#FDFBF7] px-6 py-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
      role="status"
    >
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B2F5EA]/50 text-2xl"
        aria-hidden
      >
        ✉️
      </div>
      <h2 className="lk-display mt-5 text-xl text-neutral-900">{copy.confirmationTitle}</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{copy.confirmationLead}</p>
      <p className="mt-4 break-all text-sm font-semibold text-neutral-900">{email}</p>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">{copy.confirmationSpam}</p>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">{copy.confirmationAfterClick}</p>
      <Link
        href={loginHref}
        className="mt-6 inline-flex text-sm font-semibold text-neutral-800 underline decoration-[#EFA188]/70 underline-offset-4 hover:text-[#EFA188]"
      >
        {copy.confirmationLoginCta}
      </Link>
    </div>
  );
}
