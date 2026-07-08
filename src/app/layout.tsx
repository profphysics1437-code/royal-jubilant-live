import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Royal Jubilant Real Estate LLC | Luxury Dubai Properties",
  description:
    "Royal Jubilant Real Estate LLC — Dubai's premier luxury property advisory. Buy, rent, and invest in off-plan developments, villas, penthouses and commercial real estate across Dubai's most prestigious communities.",
  keywords: [
    "Dubai real estate",
    "luxury properties Dubai",
    "Royal Jubilant",
    "off-plan Dubai",
    "Dubai villas",
    "Dubai penthouses",
    "Palm Jumeirah",
    "Downtown Dubai",
    "Dubai Marina",
    "commercial property Dubai",
  ],
  authors: [{ name: "Royal Jubilant Real Estate LLC" }],
  metadataBase: new URL("https://royaljubilant.ae"),
  alternates: {
    canonical: "https://royaljubilant.ae",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Royal Jubilant Real Estate LLC | Luxury Dubai Properties",
    description:
      "Dubai's premier luxury property advisory. Discover exceptional villas, penthouses, off-plan developments and commercial real estate.",
    url: "https://royaljubilant.ae",
    siteName: "Royal Jubilant Real Estate LLC",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Jubilant Real Estate LLC",
    description: "Luxury Dubai property advisory.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
