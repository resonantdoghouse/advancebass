import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://advancebass.com"),
  title: {
    default: "Advance Bass | Modern Bass Resources",
    template: "%s | Advance Bass",
  },
  description:
    "A premium resource for bass players featuring high-quality transcriptions, articles, and tools for modern and classic bass lines.",
  keywords: [
    "bass",
    "bass guitar",
    "transcriptions",
    "bass tabs",
    "music theory",
    "bass lessons",
    "advance bass",
  ],
  authors: [{ name: "Jim Bennett" }],
  creator: "Jim Bennett",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://advancebass.com",
    title: "Advance Bass | Modern Bass Resources",
    description:
      "High-quality, accurate transcriptions of modern and classic bass lines, completely free.",
    siteName: "Advance Bass",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advance Bass | Modern Bass Resources",
    description:
      "High-quality, accurate transcriptions of modern and classic bass lines, completely free.",
    creator: "@advancebass",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Advance Bass",
  url: "https://advancebass.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://advancebass.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

import { JsonLd } from "@/components/seo/JsonLd";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <JsonLd data={jsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T8Z9PB8LLS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T8Z9PB8LLS');
          `}
        </Script>
      </body>
    </html>
  );
}
