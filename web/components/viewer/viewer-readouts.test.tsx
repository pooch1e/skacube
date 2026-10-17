/**
 * Tests for ViewerReadouts — the channel's frequency and redshift in real
 * units, and legend ticks in millikelvin centred on 0 K.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ViewerReadouts, formatMillikelvin, legendTicks } from "./viewer-readouts";

const spectral = { startMHz: 106.1328125, stepMHz: 0.365625, length: 256 };
const stretch = { limitK: 0.1447591781616211, softeningK: 0.007237958908081055, zeroByte: 128 };

describe("ViewerReadouts", () => {
  it("shows the last channel at 199.37 MHz and z 6.12", () => {
    render(<ViewerReadouts spectral={spectral} stretch={stretch} channel={255} gradient="none" />);
    expect(screen.getByText("Channel").nextSibling).toHaveTextContent("256/ 256");
    expect(screen.getByText("Frequency").nextSibling).toHaveTextContent("199.37MHz");
    expect(screen.getByText("Redshift").nextSibling).toHaveTextContent("6.12z");
  });

  it("captions the legend in millikelvin", () => {
    render(<ViewerReadouts spectral={spectral} stretch={stretch} channel={0} gradient="none" />);
    expect(screen.getByText("Brightness temperature (mK)")).toBeInTheDocument();
  });
});

describe("legendTicks", () => {
  const ticks = legendTicks(stretch);

  it("puts 0 K in the middle and ±limit at the ends", () => {
    expect(ticks.map((t) => t.label)).toEqual(["−145", "−14", "0", "+14", "+145"]);
    expect(ticks[0].position).toBeCloseTo(0, 12);
    expect(ticks[2].position).toBe(0.5);
    expect(ticks[4].position).toBeCloseTo(1, 12);
  });

  it("spreads the ±limit/10 ticks well past a tenth of the bar, showing the asinh stretch", () => {
    expect(ticks[3].position - 0.5).toBeGreaterThan(0.15);
  });
});

describe("formatMillikelvin", () => {
  it("uses a true minus sign and one decimal below 10 mK", () => {
    expect(formatMillikelvin(-0.0013)).toBe("−1.3");
    expect(formatMillikelvin(0.0213)).toBe("+21");
  });
});
