/**
 * VolumeScene — the react-three-fiber canvas for the 3D lightcone: camera,
 * orbit controls, the raymarched volume, the box outline and the slice plane
 * that tracks the channel slider. The camera is framed to fit the box in the
 * panel's current shape. Renders on demand unless auto-rotating, so an idle
 * viewer costs no GPU time.
 */
"use client";

import { Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ComponentRef,
  type Ref,
  type RefObject,
} from "react";
import {
  BoxGeometry,
  EdgesGeometry,
  PerspectiveCamera,
  Vector3,
  type Mesh,
  type ShaderMaterial,
} from "three";
import { fitDistance } from "@/lib/viewer/camera";
import type { Volume } from "@/lib/viewer/volume";
import { createColormapTexture, createVolumeMaterial, createVolumeTexture } from "./volume-shader";

export type VolumeSceneHandle = { resetView: () => void };

type VolumeSceneProps = {
  volume: Volume;
  lut: Uint8Array;
  zeroByte: number;
  box: [number, number, number];
  channel: number;
  opacity: number;
  threshold: number;
  autoRotate: boolean;
  sliceColour: string;
  edgeColour: string;
  label: string;
  ref?: Ref<VolumeSceneHandle>;
};

const VIEW_DIRECTION = new Vector3(1.15, 0.7, 1.35).normalize();
const FIELD_OF_VIEW_DEG = 35;

type Controls = ComponentRef<typeof OrbitControls>;

/** Moves the camera back along the default view until the box fits, and makes that the reset view. */
function FitCamera({
  box,
  controls,
}: {
  box: [number, number, number];
  controls: RefObject<Controls | null>;
}) {
  const get = useThree((state) => state.get);
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height));

  useEffect(() => {
    const { camera, invalidate } = get();
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(fitDistance(box, camera.fov, aspect));
    camera.lookAt(0, 0, 0);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    controls.current?.saveState();
    invalidate();
  }, [get, box, aspect, controls]);

  return null;
}

function VolumeMesh({
  volume,
  lut,
  zeroByte,
  box,
  opacity,
  threshold,
}: Pick<VolumeSceneProps, "volume" | "lut" | "zeroByte" | "box" | "opacity" | "threshold">) {
  const mesh = useRef<Mesh<BoxGeometry, ShaderMaterial>>(null);
  const volumeTexture = useMemo(() => createVolumeTexture(volume), [volume]);
  const colormapTexture = useMemo(() => createColormapTexture(lut), [lut]);
  const material = useMemo(
    () => createVolumeMaterial(volumeTexture, colormapTexture),
    [volumeTexture, colormapTexture],
  );

  useEffect(
    () => () => {
      volumeTexture.dispose();
      colormapTexture.dispose();
      material.dispose();
    },
    [volumeTexture, colormapTexture, material],
  );

  useFrame(({ camera }) => {
    const current = mesh.current;
    if (!current) return;
    current.material.uniforms.uCameraLocal.value.copy(
      current.worldToLocal(camera.position.clone()),
    );
  });

  return (
    <mesh ref={mesh} scale={box}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive
        object={material}
        attach="material"
        uniforms-uZeroByte-value={zeroByte}
        uniforms-uOpacity-value={opacity}
        uniforms-uThreshold-value={threshold}
      />
    </mesh>
  );
}

function BoxOutline({ box, colour }: { box: [number, number, number]; colour: string }) {
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(1, 1, 1)), []);
  useEffect(() => () => edges.dispose(), [edges]);
  return (
    <lineSegments scale={box} geometry={edges}>
      <lineBasicMaterial color={colour} transparent opacity={0.6} />
    </lineSegments>
  );
}

function SlicePlane({
  box,
  channel,
  channels,
  colour,
}: {
  box: [number, number, number];
  channel: number;
  channels: number;
  colour: string;
}) {
  const z = (channel + 0.5) / channels - 0.5;
  const points = useMemo<[number, number, number][]>(
    () => [
      [-0.5, -0.5, z],
      [0.5, -0.5, z],
      [0.5, 0.5, z],
      [-0.5, 0.5, z],
      [-0.5, -0.5, z],
    ],
    [z],
  );
  return (
    <group scale={box}>
      {/* Transparent with a high renderOrder so it draws after the volume, and without depth testing so dense regions never hide it. */}
      <Line
        points={points}
        color={colour}
        lineWidth={2}
        transparent
        depthTest={false}
        renderOrder={10}
      />
    </group>
  );
}

export function VolumeScene({
  volume,
  lut,
  zeroByte,
  box,
  channel,
  opacity,
  threshold,
  autoRotate,
  sliceColour,
  edgeColour,
  label,
  ref,
}: VolumeSceneProps) {
  const controls = useRef<Controls>(null);

  useImperativeHandle(ref, () => ({ resetView: () => controls.current?.reset() }), []);

  return (
    <Canvas
      aria-label={label}
      role="img"
      flat
      dpr={[1, 1.5]}
      frameloop={autoRotate ? "always" : "demand"}
      camera={{ position: VIEW_DIRECTION.toArray(), fov: FIELD_OF_VIEW_DEG, near: 0.01, far: 20 }}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
      className="touch-none"
    >
      <VolumeMesh
        volume={volume}
        lut={lut}
        zeroByte={zeroByte}
        box={box}
        opacity={opacity}
        threshold={threshold}
      />
      <BoxOutline box={box} colour={edgeColour} />
      <SlicePlane
        box={box}
        channel={channel}
        channels={volume.shape.frequency}
        colour={sliceColour}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        enablePan={false}
        minDistance={0.6}
        maxDistance={8}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
      />
      <FitCamera box={box} controls={controls} />
    </Canvas>
  );
}
