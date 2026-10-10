import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    authInterrupts: true,
    // There is one root layout per language source, so no single layout can
    // host a 404; `src/app/global-not-found.tsx` renders its own document.
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: "/blog/fiz-meu-site-static-product.webp",
        destination: "/blog/fiz-meu-site-static-product.svg",
        permanent: false,
      },
    ];
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
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
