/**
 * Viewer — the lightcone viewer (E5): fetches the dataset and volume, then
 * shows the 3D render and the linked 2D channel slice with controls and
 * readouts. Without WebGL2 it keeps the 2D slice and says why the 3D view is
 * missing (ADR 0029). Auto-rotate starts off for visitors who prefer reduced
 * motion.
 */
"use client";

import { useMemo, useRef, useState } from "react";
import { Panel } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { useDataset, useVolume } from "@/lib/hooks";
import { useThemeColour } from "@/lib/use-theme";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { buildLut, lutToCss, readDivergingStops } from "@/lib/viewer/colormap";
import { toViewerDataset, type ViewerDataset } from "@/lib/viewer/dataset";
import { channelFrequency, channelRedshift } from "@/lib/viewer/spectral";
import { makeVolume, type Volume } from "@/lib/viewer/volume";
import { supportsWebGL2 } from "@/lib/webgl";
import { SliceView } from "./slice-view";
import { ViewerControls } from "./viewer-controls";
import { ViewerReadouts } from "./viewer-readouts";
import { VolumeScene, type VolumeSceneHandle } from "./volume-scene";

// Shader opacity per reference step at 100% on the slider. Kept low because
// the high-redshift absorption region is uniformly strong and would otherwise
// render as a solid wall.
const MAX_OPACITY_COEFFICIENT = 0.05;
const DEFAULT_OPACITY = 0.2;
const DEFAULT_THRESHOLD = 0.05;

function ViewerMessage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel title={title} className="min-h-80 items-center justify-center p-8 text-center">
      <div role="status" className="flex flex-col items-center gap-4">
        {children}
      </div>
    </Panel>
  );
}

function LoadedViewer({ dataset, volume }: { dataset: ViewerDataset; volume: Volume }) {
  const [channel, setChannel] = useState(Math.floor(dataset.spectral.length / 2));
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [autoRotateChoice, setAutoRotateChoice] = useState<boolean | null>(null);
  const [has3d] = useState(supportsWebGL2);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sliceColour = useThemeColour("--sk-accent");
  const edgeColour = useThemeColour("--sk-ink-muted");
  const scene = useRef<VolumeSceneHandle>(null);

  const autoRotate = autoRotateChoice ?? !prefersReducedMotion;
  const lut = useMemo(
    () => buildLut(readDivergingStops(), dataset.stretch.zeroByte),
    [dataset.stretch.zeroByte],
  );
  const gradient = useMemo(
    () => lutToCss(lut, dataset.stretch.zeroByte),
    [lut, dataset.stretch.zeroByte],
  );

  const frequency = channelFrequency(dataset.spectral, channel).toFixed(2);
  const redshift = channelRedshift(dataset.spectral, channel).toFixed(2);

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Panel title="Lightcone · 3D" className="min-h-80 lg:row-span-2">
        {has3d ? (
          <div className="relative aspect-square w-full lg:aspect-auto lg:flex-1">
            <div className="absolute inset-0">
              <VolumeScene
                ref={scene}
                volume={volume}
                lut={lut}
                zeroByte={dataset.stretch.zeroByte}
                box={dataset.box}
                channel={channel}
                opacity={opacity * MAX_OPACITY_COEFFICIENT}
                threshold={threshold}
                autoRotate={autoRotate}
                sliceColour={sliceColour}
                edgeColour={edgeColour}
                label={`3D render of ${dataset.title}. The highlighted plane marks channel ${channel + 1}, ${frequency} MHz.`}
              />
            </div>
          </div>
        ) : (
          <p className="m-auto max-w-sm p-8 text-center text-ink-muted">
            The 3D view needs WebGL2, which this browser does not provide. The channel slice and
            readouts below still work.
          </p>
        )}
      </Panel>

      <Panel title={`Channel slice · ${frequency} MHz`}>
        <SliceView
          volume={volume}
          lut={lut}
          channel={channel}
          label={`Channel ${channel + 1}: ${frequency} MHz, redshift ${redshift}. Brightness temperature on a diverging colour scale centred on 0 K.`}
        />
      </Panel>

      <Panel title="Controls" className="gap-6 p-4">
        <ViewerReadouts
          spectral={dataset.spectral}
          stretch={dataset.stretch}
          channel={channel}
          gradient={gradient}
        />
        <ViewerControls
          spectral={dataset.spectral}
          stretch={dataset.stretch}
          channel={channel}
          onChannelChange={setChannel}
          opacity={opacity}
          onOpacityChange={setOpacity}
          threshold={threshold}
          onThresholdChange={setThreshold}
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotateChoice}
          onResetView={() => scene.current?.resetView()}
          has3d={has3d}
        />
      </Panel>
    </div>
  );
}

export function Viewer({ datasetId }: { datasetId: string }) {
  const datasetQuery = useDataset(datasetId);
  const volumeQuery = useVolume(datasetId);

  const prepared = useMemo(() => {
    if (!datasetQuery.data || !volumeQuery.data) return null;
    try {
      const dataset = toViewerDataset(datasetQuery.data);
      return { dataset, volume: makeVolume(volumeQuery.data, dataset.shape) } as const;
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) } as const;
    }
  }, [datasetQuery.data, volumeQuery.data]);

  // An unknown id also 404s on the volume route; report the clearer cause.
  if (datasetQuery.isSuccess && datasetQuery.data === null) {
    return (
      <ViewerMessage title="Dataset not found">
        <p>
          The API has no dataset called <code className="font-mono">{datasetId}</code>.
        </p>
      </ViewerMessage>
    );
  }

  const failure =
    datasetQuery.error ??
    volumeQuery.error ??
    (prepared && "error" in prepared ? prepared.error : null);
  if (failure) {
    return (
      <ViewerMessage title="Viewer unavailable">
        <p>The lightcone could not be loaded.</p>
        <p className="font-mono text-data text-ink-muted">{failure.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void datasetQuery.refetch();
            void volumeQuery.refetch();
          }}
        >
          Try again
        </Button>
      </ViewerMessage>
    );
  }

  if (!prepared || "error" in prepared) {
    return (
      <ViewerMessage title="Loading">
        <p>Loading the lightcone volume…</p>
        <p className="font-mono text-data text-ink-muted">256³ voxels, about 10 MB</p>
      </ViewerMessage>
    );
  }

  return <LoadedViewer dataset={prepared.dataset} volume={prepared.volume} />;
}
