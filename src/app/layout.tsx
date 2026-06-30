import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://advancebass.com"),
  title: {
    default: "Advance Bass | Bass Lessons Vancouver & Online",
    template: "%s | Advance Bass",
  },
  description:
    "Professional bass lessons in Vancouver and online by Jim Bennett. Learn electric and upright bass, jazz theory, slapping, tapping, and advanced techniques. McGill University graduate.",
  keywords: [
    "bass lessons vancouver",
    "online bass lessons",
    "electric bass teacher",
    "upright bass teacher",
    "jazz bass lessons",
    "slap bass lessons",
    "tapping bass lessons",
    "bass",
    "bass guitar",
    "transcriptions",
    "bass tabs",
    "music theory",
    "advance bass",
    "jim bennett bass",
  ],
  authors: [{ name: "Jim Bennett" }],
  creator: "Jim Bennett",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://advancebass.com",
    title: "Advance Bass | Professional Bass Instruction & Resources",
    description:
      "Study with a professional touring bassist. Lessons in Vancouver or online. High-quality transcriptions and tools for modern bass players.",
    siteName: "Advance Bass",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Advance Bass — Master the Low End",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advance Bass | Jim Bennett",
    description:
      "Professional bass lessons and premium resources. Learn from a touring pro with millions of YouTube views.",
    creator: "@advancebass",
    images: ["/opengraph-image"],
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
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://advancebass.com/#person",
      name: "Jim Bennett",
      url: "https://advancebass.com",
      jobTitle: "Professional Bassist & Educator",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "McGill University",
      },
      knowsAbout: [
        "Electric Bass",
        "Upright Bass",
        "Jazz Harmony",
        "Music Theory",
        "Slap Bass",
        "Tapping",
        "Fingerstyle",
      ],
      description:
        "Professional bassist and educator specializing in electric and upright bass. McGill University graduate with extensive touring experience.",
      sameAs: [
        "https://www.youtube.com/@JimBennettBassist",
        "https://www.instagram.com/advancebass",
      ],
    },
    {
      "@type": "MusicSchool",
      "@id": "https://advancebass.com/#school",
      name: "Advance Bass Lessons",
      url: "https://advancebass.com",
      image: "https://advancebass.com/icon.png",
      description:
        "Premium bass education offering in-person lessons in Vancouver and online instruction worldwide.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vancouver",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.2827,
        longitude: -123.1207,
      },
      priceRange: "$$",
      founder: {
        "@id": "https://advancebass.com/#person",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Bass Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "In-Person Bass Lessons",
              description:
                "Private bass instruction in Vancouver, BC. Electric and upright bass, jazz theory, slap, tapping, and fingerstyle for all levels.",
              url: "https://advancebass.com/bass-lessons",
              areaServed: { "@type": "City", name: "Vancouver" },
              provider: { "@id": "https://advancebass.com/#person" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Online Bass Lessons",
              description:
                "Private online bass lessons worldwide via Zoom. All levels, all styles.",
              url: "https://advancebass.com/bass-lessons",
              areaServed: "Worldwide",
              provider: { "@id": "https://advancebass.com/#person" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Remote Session Recording",
              description:
                "Professional bass tracks recorded and delivered remotely. High-quality WAV files, fast turnaround.",
              url: "https://advancebass.com/recording",
              provider: { "@id": "https://advancebass.com/#person" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Bassist for Hire — Live Performance",
              description:
                "Experienced live bassist available for gigs, tours, and showcases across Rock, Funk, Soul, Jazz, and R&B.",
              url: "https://advancebass.com/bassist-for-hire",
              provider: { "@id": "https://advancebass.com/#person" },
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://advancebass.com/#website",
      url: "https://advancebass.com",
      name: "Advance Bass",
      publisher: {
        "@id": "https://advancebass.com/#person",
      },
    },
  ],
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
        className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <JsonLd data={jsonLd} />
        <GlobalThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </GlobalThemeProvider>

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
