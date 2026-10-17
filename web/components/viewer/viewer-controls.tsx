/**
 * ViewerControls — the channel slider and render controls (opacity,
 * threshold, auto-rotate, reset view), all keyboard-operable Radix
 * primitives. Slider thumbs carry value text in real units for screen readers.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { channelFrequency, channelRedshift, type SpectralAxis } from "@/lib/viewer/spectral";
import { scaledToKelvin, type Stretch } from "@/lib/viewer/stretch";
import { formatMillikelvin } from "./viewer-readouts";

type ViewerControlsProps = {
  spectral: SpectralAxis;
  stretch: Stretch;
  channel: number;
  onChannelChange: (channel: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  threshold: number;
  onThresholdChange: (threshold: number) => void;
  autoRotate: boolean;
  onAutoRotateChange: (autoRotate: boolean) => void;
  onResetView: () => void;
  has3d: boolean;
};

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-label text-ink-muted uppercase">{label}</span>
        <span className="font-mono text-data tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  );
}

export function ViewerControls(props: ViewerControlsProps) {
  const { spectral, stretch, channel, opacity, threshold, autoRotate, has3d } = props;
  const frequency = channelFrequency(spectral, channel).toFixed(2);
  const redshift = channelRedshift(spectral, channel).toFixed(2);
  const thresholdMk = formatMillikelvin(scaledToKelvin(threshold, stretch)).replace("+", "");
  const opacityPercent = `${Math.round(opacity * 100)}%`;

  return (
    <div className="flex flex-col gap-6">
      <ControlRow label="Frequency" value={`${frequency} MHz · z ${redshift}`}>
        <Slider
          min={0}
          max={spectral.length - 1}
          step={1}
          value={[channel]}
          onValueChange={([value]) => props.onChannelChange(value)}
          thumbProps={{
            "aria-label": "Channel",
            "aria-valuetext": `Channel ${channel + 1} of ${spectral.length}, ${frequency} MHz, redshift ${redshift}`,
          }}
        />
      </ControlRow>

      {has3d && (
        <>
          <ControlRow label="Opacity" value={opacityPercent}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[opacity]}
              onValueChange={([value]) => props.onOpacityChange(value)}
              thumbProps={{ "aria-label": "Opacity", "aria-valuetext": opacityPercent }}
            />
          </ControlRow>

          <ControlRow label="Hide below" value={`|T| ${thresholdMk} mK`}>
            <Slider
              min={0}
              max={0.9}
              step={0.01}
              value={[threshold]}
              onValueChange={([value]) => props.onThresholdChange(value)}
              thumbProps={{
                "aria-label": "Hide values below",
                "aria-valuetext": `${thresholdMk} millikelvin`,
              }}
            />
          </ControlRow>

          <div className="flex flex-wrap gap-2">
            <Toggle
              variant="outline"
              size="sm"
              pressed={autoRotate}
              onPressedChange={props.onAutoRotateChange}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Auto-rotate
            </Toggle>
            <Button variant="outline" size="sm" onClick={props.onResetView}>
              Reset view
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
