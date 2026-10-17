/**
 * Volume raymarch shader (ADR 0010, ADR 0015) — front-to-back compositing
 * through a unit box in object space, coloured by the diverging LUT, with
 * opacity following |value| so 0 K (ionised hydrogen) is fully transparent.
 *
 * The mesh is a 1×1×1 box scaled to the lightcone's proportions; rays are
 * traced in object space so texture steps stay one texel apart on every axis.
 */
import {
  Data3DTexture,
  DataTexture,
  GLSL3,
  LinearFilter,
  NoColorSpace,
  RedFormat,
  RGBAFormat,
  ShaderMaterial,
  UnsignedByteType,
  Vector3,
  NormalBlending,
  BackSide,
} from "three";
import type { Volume } from "@/lib/viewer/volume";

export const REFERENCE_STEPS = 256;
const MAX_STEPS = 1024;

const vertexShader = /* glsl */ `
uniform vec3 uCameraLocal;
out vec3 vOrigin;
out vec3 vDirection;

void main() {
  vOrigin = uCameraLocal;
  vDirection = position - uCameraLocal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
precision highp sampler3D;

uniform sampler3D uVolume;
uniform sampler2D uColormap;
uniform float uZeroByte;
uniform float uOpacity;
uniform float uThreshold;
uniform float uSteps;

in vec3 vOrigin;
in vec3 vDirection;
out vec4 fragColor;

vec2 hitBox(vec3 origin, vec3 direction) {
  vec3 inverse = 1.0 / direction;
  vec3 t0 = (vec3(-0.5) - origin) * inverse;
  vec3 t1 = (vec3(0.5) - origin) * inverse;
  vec3 tNear = min(t0, t1);
  vec3 tFar = max(t0, t1);
  return vec2(max(max(tNear.x, tNear.y), tNear.z), min(min(tFar.x, tFar.y), tFar.z));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 direction = normalize(vDirection);
  vec2 bounds = hitBox(vOrigin, direction);
  if (bounds.x > bounds.y) discard;
  bounds.x = max(bounds.x, 0.0);

  float dt = 1.0 / uSteps;
  // Jittering the first sample trades banding for fine noise.
  float t = bounds.x + dt * hash(gl_FragCoord.xy);
  vec4 accumulated = vec4(0.0);

  for (int i = 0; i < ${MAX_STEPS}; i++) {
    if (t > bounds.y) break;
    vec3 p = vOrigin + direction * t + 0.5;
    // Stored row 0 is north (ingest flips FITS rows), and object +y is up.
    float stored = texture(uVolume, vec3(p.x, 1.0 - p.y, p.z)).r * 255.0;
    float magnitude = min(abs(stored - uZeroByte) / 127.0, 1.0);
    if (magnitude > uThreshold) {
      vec3 colour = texture(uColormap, vec2((stored + 0.5) / 256.0, 0.5)).rgb;
      // Opacity is defined per reference step, then corrected for the actual
      // step so the look does not change with the sample count.
      float alpha = 1.0 - pow(1.0 - clamp(magnitude * uOpacity, 0.0, 0.999), dt * ${REFERENCE_STEPS}.0);
      accumulated.rgb += (1.0 - accumulated.a) * alpha * colour;
      accumulated.a += (1.0 - accumulated.a) * alpha;
      if (accumulated.a > 0.97) break;
    }
    t += dt;
  }

  if (accumulated.a < 0.002) discard;
  fragColor = accumulated;
}
`;

export function createVolumeTexture(volume: Volume): Data3DTexture {
  const texture = new Data3DTexture(
    volume.bytes,
    volume.shape.ra,
    volume.shape.dec,
    volume.shape.frequency,
  );
  texture.format = RedFormat;
  texture.type = UnsignedByteType;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.unpackAlignment = 1;
  texture.colorSpace = NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createColormapTexture(lut: Uint8Array): DataTexture {
  const texture = new DataTexture(lut, lut.length / 4, 1, RGBAFormat, UnsignedByteType);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createVolumeMaterial(volume: Data3DTexture, colormap: DataTexture): ShaderMaterial {
  // Output is premultiplied and already in display (sRGB) values: the LUT
  // holds token colours as authored, so no colour-space conversion applies.
  return new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader,
    fragmentShader,
    uniforms: {
      uVolume: { value: volume },
      uColormap: { value: colormap },
      uCameraLocal: { value: new Vector3() },
      uZeroByte: { value: 128 },
      uOpacity: { value: 0 },
      uThreshold: { value: 0 },
      uSteps: { value: REFERENCE_STEPS },
    },
    side: BackSide,
    transparent: true,
    depthWrite: false,
    premultipliedAlpha: true,
    blending: NormalBlending,
    toneMapped: false,
  });
}
