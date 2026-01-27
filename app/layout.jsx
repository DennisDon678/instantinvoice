import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#FFE500",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://instantinvoice.vercel.app'),
  title: "InstantInvoice - Create Professional Invoices",
  description: "Create and manage professional invoices instantly with InstantInvoice. Simple, fast, and efficient invoicing for your business.",
  keywords: ["invoice", "invoicing", "business", "billing", "receipt", "professional invoice", "invoice generator"],
  authors: [{ name: "InstantInvoice" }],
  creator: "InstantInvoice",
  publisher: "InstantInvoice",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InstantInvoice",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "InstantInvoice - Create Professional Invoices",
    description: "Create and manage professional invoices instantly with InstantInvoice. Simple, fast, and efficient invoicing for your business.",
    siteName: "InstantInvoice",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantInvoice - Create Professional Invoices",
    description: "Create and manage professional invoices instantly with InstantInvoice. Simple, fast, and efficient invoicing for your business.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import PWARegistration from "@/components/PWARegistration";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-TVMMGQ96DT" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 flex justify-center h-dvh w-full overflow-hidden`}
      >
        <PWARegistration />
        <div className="w-full max-w-3xl bg-white h-full shadow-2xl relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
