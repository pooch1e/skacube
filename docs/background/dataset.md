# Dataset: EoR_H21cm_truth.fits

Facts read from the file's header and five sampled channels (2026-10-12).

## Shape

| Property | Value |
|---|---|
| Size | 981 MB (one HDU, no extensions) |
| Axes | 512 × 512 × 936, float32 |
| Axis 1, 2 | RA, Dec, `SIN` projection, 0.015625° per pixel → 8° × 8° field centred on RA 0°, Dec −30° |
| Axis 3 | Frequency, 106.0 → 199.5 MHz in 100 kHz steps |
| Unit | `K` (21 cm brightness temperature) |
| NaNs | None in sampled channels |

## What it shows

A simulated, noise-free ("truth") model of neutral hydrogen during the **Epoch of Reionisation**. The 21 cm line (1420.4 MHz) is redshifted, so each frequency is a different redshift and therefore a different distance and cosmic time:

| Frequency | Redshift z | Sampled values |
|---|---|---|
| 106 MHz | 12.4 | all negative, ≈ −0.13 K (absorption) |
| 129 MHz | 10.0 | mostly negative, a few positive |
| 153 MHz | 8.3 | positive, ≈ +0.01 K (emission) |
| 176 MHz | 7.1 | positive, bubbles of zero appearing |
| 199.5 MHz | 6.1 | exactly 0 (hydrogen fully ionised) |

`z = 1420.4 / f − 1`.

## Consequences for design

- Unlike most radio cubes, the third axis here **is** line-of-sight depth: a 3D render is a lightcone through cosmic time.
- Values are **signed** and cross zero. A sequential colormap would hide the absorption–emission transition; see [ADR 0015](../adr/0015-diverging-colormap.md).
- At 981 MB the raw file can't go in git or to the browser. See [data flow](../architecture/data-flow.md).

## Source

- Published by SKAO as part of **SKA Science Data Challenge 3a**: https://www.skao.int/en/science-users/170/simulated-data-products/ska-low-eor (direct download, no registration).
- Cite Bonaldi et al. (2025), arXiv:2503.11740. No licence is stated. See [ADR 0017](../adr/0017-dataset-provenance.md).
- SHA-256: `8d41d89f934b5be9d190b0bd651daecb239b4f4b8e0815ae1a40c5f6d18d5b60`
