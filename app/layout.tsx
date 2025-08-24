import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const bricolageGrot = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mudra Wallet — Effortless Multichain Access in One Place",
  description:
    "Mudra is a lightweight, web-based multichain wallet that lets you connect, switch, and manage assets across blockchains — instantly. No installs, just pure Web3.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  openGraph: {
    title: "Mudra Wallet — Effortless Multichain Access in One Place",
    description:
      "Mudra is a lightweight, web-based multichain wallet that lets you connect, switch, and manage assets across blockchains — instantly. No installs, just pure Web3.",
    type: "website",
    url: "https://mudra-wallet-wine.vercel.app",
    images: [
      {
        url: "/og-img.png",
        width: 1200,
        height: 630,
        alt: "Mudra Wallet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mudra Wallet — Effortless Multichain Access in One Place",
    description:
      "Mudra is a lightweight, web-based multichain wallet that lets you connect, switch, and manage assets across blockchains — instantly. No installs, just pure Web3.",
    images: ["/og-img.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
        className={`   ${montserrat.variable} ${bricolageGrot.variable}  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />

          <main className="flex justify-center">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
