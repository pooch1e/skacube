/**
 * RootLayout — HTML shell, fonts, theme and providers for every page. Fonts
 * are self-hosted (SIL OFL, latin subset; see fonts/LICENSE.md) so builds need
 * no network. The inline <head> script sets data-theme before first paint,
 * which keeps pages static (no cookie read) without a theme flash.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { themeScript } from "@/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

const display = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  variable: "--font-big-shoulders-display",
  weight: "100 900",
});

const body = localFont({
  src: "./fonts/hanken-grotesk.woff2",
  variable: "--font-hanken-grotesk",
  weight: "100 900",
});

const mono = localFont({
  src: "./fonts/martian-mono.woff2",
  variable: "--font-martian-mono",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "Skacube",
  description: "A 3D viewer for a simulated SKA-Low 21 cm lightcone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
