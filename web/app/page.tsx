/**
 * Home — stage 1 placeholder on the Skacube tokens and type. Confirms the web
 * app is up, can reach the API through the same origin, and can switch theme;
 * replaced by the splash page in E6.
 */
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiStatus } from "./api-status";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 md:p-8">
      <h1 className="font-display text-display-l">Skacube</h1>
      <p className="max-w-md text-center text-ink-muted">
        Exploring a simulated SKA-Low 21 cm lightcone in 3D. Under construction.
      </p>
      <ApiStatus />
      <ThemeToggle />
    </main>
  );
}
