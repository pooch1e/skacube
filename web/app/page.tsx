/**
 * Home — stage 1 page: a short header, the lightcone viewer and the API and
 * theme status. The page itself is static; the viewer loads in the browser
 * (ADR 0011). Replaced by the designed splash page in E6.
 */
import { ThemeToggle } from "@/components/theme-toggle";
import { ViewerLoader } from "@/components/viewer/viewer-loader";
import { ApiStatus } from "./api-status";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-l">Skacube</h1>
          <p className="max-w-2xl text-ink-muted">
            Simulated 21 cm lightcone (SKA Science Data Challenge 3a, noise-free model). Frequency
            runs along the depth: 106 MHz at redshift 12.4 to 199 MHz at redshift 6.1.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <ViewerLoader />
      <footer className="flex flex-wrap justify-between gap-4 text-ink-muted">
        <ApiStatus />
      </footer>
    </main>
  );
}
