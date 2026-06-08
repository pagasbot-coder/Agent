import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Crawl rules — only `/waitlist` indexed until public beta (T-053). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/waitlist",
      disallow: ["/", "/onboarding", "/login", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
