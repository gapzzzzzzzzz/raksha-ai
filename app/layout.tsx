import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Raksha AI - AI Health Triage 24/7",
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
    title: "Raksha AI - AI Health Triage 24/7",
    description: "Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia",
    siteName: "Raksha AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raksha AI - AI Health Triage 24/7",
    description: "Triage kesehatan berbasis AI yang inklusif dan kontekstual untuk Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raksha AI" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
