import type { Metadata } from "next";
import { Google_Sans, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import MobileNav from "@/components/layouts/MobileNav";
import { SoundProvider } from "@/components/providers/SoundProvider";

import { Toaster } from 'react-hot-toast'

const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrainSharp AI",
  description: "Your intelligent AI workspace.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${googleSans.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body id="top" className="flex min-h-screen flex-col bg-[#050507] font-sans text-zinc-100">
        <Toaster
          position="top-center"
          reverseOrder={false}
        />

        <SoundProvider>
          <Navbar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </SoundProvider>
      </body>
    </html>
  );
}