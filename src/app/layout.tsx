import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import { SoundProvider } from "@/components/providers/SoundProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
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
      className={`${spaceGrotesk.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="neural-background min-h-full flex flex-col font-sans">
        <SoundProvider>
          <Navbar />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}