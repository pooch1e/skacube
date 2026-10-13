/**
 * RootLayout — HTML shell, fonts and global styles for every page. Fonts
 * are self-hosted (Geist, SIL OFL, latin subset) so builds need no network;
 * fonts and tokens move to the Skacube design system in E4.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Skacube",
  description: "A 3D viewer for a simulated SKA-Low 21 cm lightcone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
