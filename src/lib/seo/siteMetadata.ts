import type { Metadata } from "next";
import { buildAppUrl, getAppUrl } from "@/config/app";

const SITE_NAME = "CraftLink";

export function getMetadataBase(): URL {
  return new URL(getAppUrl());
}

export function buildDefaultSiteMetadata(overrides?: Metadata): Metadata {
  const base = getMetadataBase();
  return {
    metadataBase: base,
    applicationName: SITE_NAME,
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      url: base,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
    },
    alternates: {
      canonical: base,
    },
    ...overrides,
  };
}

export function buildPageOpenGraph(options: {
  title: string;
  description: string;
  path?: string;
}): Metadata["openGraph"] {
  const url = options.path ? buildAppUrl(options.path) : getAppUrl();
  return {
    title: options.title,
    description: options.description,
    url,
    siteName: SITE_NAME,
    type: "website",
  };
}
