import { execSync } from "node:child_process";
import type { NextConfig } from "next";

/**
 * The date the site's hand-written copy last changed, fixed at build time.
 *
 * The sitemap and llms.txt regenerate every few minutes, so reading "now" at
 * render time made every static page claim it had just been modified — and
 * search engines learn to ignore a sitemap whose `lastmod` always moves.
 * Precedence: an explicit SITE_LAST_MODIFIED, then the commit being built,
 * then the build itself (Docker images ship without .git).
 */
function siteLastModified(): string {
  const fromEnv = process.env.SITE_LAST_MODIFIED?.trim();
  if (fromEnv) return fromEnv;
  try {
    const commitDate = execSync("git log -1 --format=%cI", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (commitDate) return commitDate;
  } catch {
    // No git (Docker build context) — fall through to the build time.
  }
  return new Date().toISOString();
}

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (`.next/standalone`) so the Docker
  // runner stage can ship without node_modules. Harmless on Vercel.
  output: "standalone",
  // Inlined at build, so every render of this deployment agrees on one date.
  env: {
    SITE_LAST_MODIFIED: siteLastModified(),
  },
  images: {
    remotePatterns: [
      // Instant dev placeholders
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Curated free photography
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Admin uploads
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
