import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import type { SessionWithProfile } from "@/services/authService";
import type { AuthDashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { defaultLocale } from "@/i18n/config";

type DashboardShellProps = {
  lang: Locale;
  session: SessionWithProfile;
  copy: AuthDashboardDictionary;
};

export function DashboardShell({ lang, session, copy }: DashboardShellProps) {
  const home = lang === defaultLocale ? "/" : `/${lang}`;
  const { user, profile } = session;

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <Link href={home} className="font-bold text-black">
            CraftLink
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={lang} />
            <button
              type="submit"
              className="text-sm font-semibold text-neutral-600 hover:text-black"
            >
              {copy.signOut}
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-neutral-600">{copy.welcome}</p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-neutral-500">{copy.email}</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-500">{copy.workspace}</dt>
              <dd className="mt-1 font-mono text-xs">{profile.workspace_id}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-500">{copy.role}</dt>
              <dd className="mt-1 font-medium">{profile.role}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-500">{copy.plan}</dt>
              <dd className="mt-1 font-medium">{profile.plan_tier}</dd>
            </div>
            {profile.full_name ? (
              <div>
                <dt className="font-semibold text-neutral-500">{copy.name}</dt>
                <dd className="mt-1 font-medium">{profile.full_name}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <p className="mt-6 text-sm text-neutral-500">{copy.placeholder}</p>
      </main>
    </div>
  );
}
