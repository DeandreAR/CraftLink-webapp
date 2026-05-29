import Link from "next/link";

export default function VitrineNotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl font-bold text-black">404</p>
      <p className="mt-2 text-neutral-600">Cette page artisan n’existe pas ou n’est plus active.</p>
      <Link
        href="/"
        className="mt-6 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white"
      >
        Retour à CraftLink
      </Link>
    </div>
  );
}
