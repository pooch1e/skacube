/**
 * SliceView — one frequency channel drawn in 2D through the shared colormap
 * LUT, cut from the volume already in memory (ADR 0020). Uses a plain 2D
 * canvas, so it also works where WebGL2 does not. Pixels are shown unsmoothed
 * so the 256² sampling is honest.
 */
"use client";

import { useEffect, useRef } from "react";
import { sliceChannel, type Volume } from "@/lib/viewer/volume";

type SliceViewProps = {
  volume: Volume;
  lut: Uint8Array;
  channel: number;
  label: string;
};

export function SliceView({ volume, lut, channel, label }: SliceViewProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { ra, dec } = volume.shape;

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const slice = sliceChannel(volume, channel);
    const image = context.createImageData(ra, dec);
    for (let i = 0; i < slice.length; i++) {
      const lutIndex = slice[i] * 4;
      image.data[i * 4] = lut[lutIndex];
      image.data[i * 4 + 1] = lut[lutIndex + 1];
      image.data[i * 4 + 2] = lut[lutIndex + 2];
      image.data[i * 4 + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }, [volume, lut, channel, ra, dec]);

  return (
    <canvas
      ref={canvas}
      width={ra}
      height={dec}
      role="img"
      aria-label={label}
      className="block h-auto w-full [image-rendering:pixelated]"
      style={{ aspectRatio: `${ra} / ${dec}` }}
    />
  );
}
