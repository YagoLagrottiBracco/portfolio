import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    authInterrupts: true,
    // There is one root layout per language source, so no single layout can
    // host a 404; `src/app/global-not-found.tsx` renders its own document.
    globalNotFound: true,
  },
  images: {
    // Browsers that accept AVIF get it (usually the smallest), the rest WebP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Repo-only projects fall back to GitHub's OpenGraph card as their cover.
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const dev = process.env.NODE_ENV !== "production";
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    const webmention = process.env.WEBMENTION_GITHUB_TOKEN?.trim()
      ? [{ source: "/:path*", headers: [{ key: "Link", value: '<https://lagrotti.dev/api/webmention>; rel="webmention"' }] }]
      : [];
    return [
      ...webmention,
      // Everything except the embeddable tools, which other sites are meant to frame.
      { source: "/((?!(?:en/|es/)?incorporar(?:/|$)).*)", headers: securityHeaders({ dev, sentryDsn }) },
      { source: "/incorporar/:path*", headers: securityHeaders({ dev, embeddable: true, sentryDsn }) },
      { source: "/:locale(en|es)/incorporar/:path*", headers: securityHeaders({ dev, embeddable: true, sentryDsn }) },
      // The editor is private; keep it out of every index even if a link leaks.
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
