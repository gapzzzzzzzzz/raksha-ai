import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Raksha - AI Health Triage 24/7",
  description: "Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia",
  manifest: "/manifest.json",
  themeColor: "#0EA5E9",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://raksha-ai.com",
    title: "Raksha - AI Health Triage 24/7",
    description: "Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia",
    siteName: "Raksha",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raksha - AI Health Triage 24/7",
    description: "Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raksha" />
      </head>
      <body className="font-sans antialiased bg-rk-bg text-rk-text">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
