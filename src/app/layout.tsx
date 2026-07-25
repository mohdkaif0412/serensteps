import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { site } from "@/lib/site";
import { Analytics } from "@/components/seo/Analytics";

// Display / headings — a gentle literary serif for the reflective copy.
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

// Body / UI — clean, warm, humanist.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // With a service area configured, the home title leads with the local
    // search intent; without one it leads with the brand promise.
    default: site.serviceArea
      ? `${site.name} — Counselling & Therapy in ${site.serviceArea}`
      : `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // One list of subjects, shared with `knowsAbout` in JSON-LD — see site.topics.
  keywords: [
    ...site.topics.map((topic) => topic.toLowerCase()),
    ...(site.serviceArea ? [`therapist in ${site.serviceArea}`] : []),
    "Serene Step",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
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
      className={`${newsreader.variable} ${jakarta.variable} antialiased`}
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
