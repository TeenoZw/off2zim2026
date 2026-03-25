import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";
import GlobalBackground from "../components/GlobalBackground";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Off2Zim - Explore | Experience | Enjoy",
  description:
    "Explore, experience, and enjoy Zimbabwe with Off2Zim. Find trusted stays, experiences, transport, and local guidance in one destination-first platform.",
  keywords:
    "Zimbabwe, travel, tourism, hotels, activities, dining, events, Victoria Falls, safari, adventure",
  authors: [{ name: "Off2Zim Team" }],
  creator: "Off2Zim",
  publisher: "Off2Zim",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://off2zim.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Off2Zim - Explore | Experience | Enjoy",
    description:
      "Explore, experience, and enjoy Zimbabwe with trusted stays, experiences, transport, and local guidance.",
    url: "https://off2zim.com",
    siteName: "Off2Zim",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Off2Zim - Zimbabwe Travel Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Off2Zim - Explore | Experience | Enjoy",
    description:
      "Explore, experience, and enjoy Zimbabwe with trusted stays, experiences, transport, and local guidance.",
    images: ["/images/og-image.jpg"],
    creator: "@off2zim",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/favicon.png" />
        <link
          rel="preload"
          href="/fonts/centurygothic.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/centurygothic_bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
      </head>
      <body className="font-century-gothic antialiased">
        <GlobalBackground />
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
