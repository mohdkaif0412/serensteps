import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { site } from "@/lib/site";
import { Analytics } from "@/components/seo/Analytics";

// The site's one typeface, for both headings and body copy.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Fallback only — the homepage sets its own (see app/(site)/page.tsx).
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // One list of subjects, shared with `knowsAbout` in JSON-LD — see site.topics.
  keywords: [
    ...site.topics.map((topic) => topic.toLowerCase()),
    ...(site.serviceArea ? [`therapist in ${site.serviceArea}`] : []),
    "Serene Steps",
  ],
  manifest: "/manifest.webmanifest",
  // Search Console / Bing Webmaster verification, set per environment.
  verification: {
    google: site.verification.google || undefined,
    other: site.verification.bing
      ? { "msvalidate.01": site.verification.bing }
      : undefined,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  // Deliberately no `alternates.canonical`, og:title/og:url or twitter:title
  // here. Next merges metadata shallowly, so anything set at the root is
  // inherited by every page that doesn't override it — a root canonical of "/"
  // once told Google that /privacy and /terms were duplicates of the homepage,
  // and nine pages shared the homepage's og:title and og:url. Each page sets
  // all of these together through `pageMetadata` (src/lib/seo.ts).
  openGraph: {
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * The browser chrome takes the brand forest, so the page doesn't end at a strip
 * of system grey. Declared here rather than in `metadata` — Next wants
 * theme-color and viewport in their own export.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#174238" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-paper text-forest">
        {children}
        <Analytics />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--color-forest)",
              color: "var(--color-paper)",
              border: "1px solid var(--color-sage-deep)",
            },
          }}
        />
      </body>
    </html>
  );
}
