import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import type { AuthDashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { MeshBackground } from "@/components/landing/MeshBackground";

type DashboardShellProps = {
  lang: Locale;
  session: WorkspaceSession;
  copy: AuthDashboardDictionary;
};

export function DashboardShell({ lang, session, copy }: DashboardShellProps) {
  const home = lang === defaultLocale ? "/" : `/${lang}`;
  const { user, profile, workspaceId } = session;

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 text-black">
      <MeshBackground intensity="subtle" />

      <header className="relative z-10 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href={home}
            className="landing-nav-logo inline-flex shrink-0 items-center text-black"
            aria-label="CraftLink"
          >
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="landing-nav-logo-img block h-6 w-auto max-w-none md:h-7"
              decoding="async"
            />
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={lang} />
            <button
              type="submit"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
            >
              {copy.signOut}
            </button>
          </form>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 text-base text-neutral-600">{copy.welcome}</p>

        <div className="mt-8 rounded-[24px] border border-neutral-200/90 bg-white/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-8">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-neutral-500">{copy.email}</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-neutral-500">{copy.workspace}</dt>
              <dd className="mt-1 font-mono text-xs">{workspaceId}</dd>
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
