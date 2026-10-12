/**
 * Home — stage 1 placeholder. Confirms the web app is up and can reach the
 * API through the same origin; replaced by the splash page in E6.
 */
import { ApiStatus } from "./api-status";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Skacube</h1>
      <p className="max-w-md text-center">
        Exploring a simulated SKA-Low 21 cm lightcone in 3D. Under construction.
      </p>
      <ApiStatus />
    </main>
  );
}
