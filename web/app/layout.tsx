/**
 * RootLayout — HTML shell, font, theme and providers for every page. The
 * font is self-hosted (SIL OFL; see fonts/LICENSE.md) so builds need no
 * network. The inline <head> script sets data-theme before first paint,
 * which keeps pages static (no cookie read) without a theme flash.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { themeScript } from "@/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.otf",
  variable: "--font-departure-mono",
  weight: "400",
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
      className={`${departureMono.variable} h-full antialiased`}
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
