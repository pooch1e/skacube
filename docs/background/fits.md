# FITS primer

FITS (Flexible Image Transport System) is astronomy's standard file format.

## Structure

- A file is a sequence of **HDUs** (header + data units). Data may be in the primary HDU or an extension (`IMAGE`, `BINTABLE`).
- Everything is padded to **2880-byte blocks**.
- **Header**: ASCII, 80-character cards, `KEYWORD = value / comment`, ending at `END`.
- **Data**: big-endian binary, x (`NAXIS1`) varying fastest. Row 1 is the bottom of the image.

## Keywords that matter here

| Keyword | Meaning |
|---|---|
| `BITPIX` | Data type: 8, 16, 32, 64 (ints), -32, -64 (floats) |
| `NAXIS`, `NAXISn` | Number of axes and their lengths |
| `BSCALE`, `BZERO` | `physical = BZERO + BSCALE × raw` |
| `BLANK` | Null value for integer data (floats use NaN) |
| `CTYPEn`, `CRVALn`, `CRPIXn`, `CDELTn` | World coordinates (RA/Dec, velocity, frequency) |
| `BUNIT` | Physical unit, e.g. `Jy/beam` |

## Data cubes

Radio cubes have three axes: RA, Dec, and **velocity or frequency**. The third axis is not depth. Many also carry a degenerate fourth Stokes axis of length 1.

## Rendering

Astronomical data has a huge dynamic range. Clip to percentiles, then apply a non-linear stretch (asinh, log or sqrt) before mapping to colour.
