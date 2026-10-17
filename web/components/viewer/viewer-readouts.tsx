/**
 * ViewerReadouts — where the slice sits along the lightcone: channel,
 * observed frequency and redshift, plus the colormap legend in millikelvin
 * centred on 0 K. Ticks are placed through the stretch, so the asinh
 * compression near zero is visible in their spacing.
 */
import { ColormapLegend, type LegendTick } from "@/components/colormap-legend";
import { Readout } from "@/components/readout";
import { channelFrequency, channelRedshift, type SpectralAxis } from "@/lib/viewer/spectral";
import { kelvinToScaled, type Stretch } from "@/lib/viewer/stretch";

type ViewerReadoutsProps = {
  spectral: SpectralAxis;
  stretch: Stretch;
  channel: number;
  gradient: string;
};

export function formatMillikelvin(kelvin: number): string {
  const mk = kelvin * 1000;
  const rounded = Math.abs(mk) >= 10 ? mk.toFixed(0) : mk.toFixed(1);
  return mk > 0 ? `+${rounded}` : rounded.replace("-", "−");
}

export function legendTicks(stretch: Stretch): LegendTick[] {
  const tenth = stretch.limitK / 10;
  return [-stretch.limitK, -tenth, 0, tenth, stretch.limitK].map((kelvin) => ({
    position: (kelvinToScaled(kelvin, stretch) + 1) / 2,
    label: kelvin === 0 ? "0" : formatMillikelvin(kelvin),
  }));
}

export function ViewerReadouts({ spectral, stretch, channel, gradient }: ViewerReadoutsProps) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-3 gap-4">
        <Readout label="Channel" value={`${channel + 1}`} unit={`/ ${spectral.length}`} />
        <Readout
          label="Frequency"
          value={channelFrequency(spectral, channel).toFixed(2)}
          unit="MHz"
        />
        <Readout label="Redshift" value={channelRedshift(spectral, channel).toFixed(2)} unit="z" />
      </dl>
      <ColormapLegend
        caption="Brightness temperature (mK)"
        gradient={gradient}
        ticks={legendTicks(stretch)}
      />
    </div>
  );
}
