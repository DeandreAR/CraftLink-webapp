import path from "node:path";
import type { NextConfig } from "next";

/**
 * Évite l’avertissement « multiple lockfiles » quand un `package-lock.json`
 * existe plus haut dans l’arborescence (ex. dossier utilisateur).
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
 */
const nextConfig: NextConfig = {
  turbopack: {
    // `__dirname` avec `next.config.ts` peut ne pas être le dossier du projet
    // (bundle / cache) : la racine serait alors trop étroite et `src/app` ne serait
    // pas résolu → page vide / pas de route `/`. `process.cwd()` suit le répertoire
    // d’exécution (`npm run dev` / `build` depuis ce package).
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
