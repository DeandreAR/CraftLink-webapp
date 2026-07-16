import { buildAppUrl } from "@/config/app";
import type { MetierLandingFaqItem, MetierLandingLocaleContent } from "@/lib/seo/metierLandingTypes";

export function buildMetierLandingJsonLd(options: {
  path: string;
  content: MetierLandingLocaleContent;
}): object {
  const url = buildAppUrl(options.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "CraftLink",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url,
        description: options.content.seoDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: options.content.faq.map((item: MetierLandingFaqItem) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
