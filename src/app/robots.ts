import type { MetadataRoute } from "next";
import { getAppHostname, getAppUrl } from "@/config/app";

/**
 * robots.txt dynamique — indexe le marketing + les vitrines publiques,
 * bloque les espaces authentifiés et l’API.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/admin",
          "/admin/",
          "/api/",
          "/onboarding",
          "/onboarding/",
          "/login",
          "/login/",
          "/signup",
          "/signup/",
          "/connexion",
          "/inscription",
          "/share/",
          "/aff/",
          "/v/",
          "/p/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: getAppHostname(),
  };
}
