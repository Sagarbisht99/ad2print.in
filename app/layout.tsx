import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

// Fonts are self-hosted so builds never depend on a Google Fonts response.
// (next/font/google can fail with "queries have exactly one entry" in Turbopack
// when Google returns extensionless /l/font?kit=… URLs — see vercel/next.js#99114.)
const display = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

const body = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AD2PRINT — Book Newspaper Ads Online India",
    template: "%s · AD2PRINT",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "advertising",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE.name,
    title: "AD2PRINT — Book Newspaper Ads Online India",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og/ad2print-1200x630.png",
        width: 1200,
        height: 630,
        alt: "AD2PRINT — book newspaper ads in 280+ Indian papers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AD2PRINT — Book Newspaper Ads Online",
    description: DEFAULT_DESCRIPTION,
    images: ["/og/ad2print-1200x630.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "default",
  },
  // Local SEO signals for the Ghaziabad / Indirapuram desk.
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Ghaziabad, Indirapuram",
    "geo.position": "28.6416;77.3708",
    ICBM: "28.6416, 77.3708",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport = {
  themeColor: "#c8102e",
  width: "device-width",
  initialScale: 1,
};

const GTM_ID = "GTM-NQFQ5KWW";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-ink">
        {/* Google Tag Manager — script (as pasted) */}
        <Script
          id="gtm-script"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtm-data-layer" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        {/* Google Tag Manager — noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
