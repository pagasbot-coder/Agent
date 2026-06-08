import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Public routes only — dashboard `/` excluded until beta (T-053). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/waitlist`,
      lastModified: new Date("2026-06-07"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
