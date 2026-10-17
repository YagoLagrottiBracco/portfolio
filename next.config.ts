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
    return [
      { source: "/:path*", headers: securityHeaders({ dev: process.env.NODE_ENV !== "production" }) },
      // The editor is private; keep it out of every index even if a link leaks.
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
