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
      </body>
    </html>
  );
}
