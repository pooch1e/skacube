# 0017. Label the data as a simulation, with credit

- Status: Accepted
- Date: 2026-10-12

## Context

The file is the noise-free "truth" cube from SKA Science Data Challenge 3a, published by SKAO at https://www.skao.int/en/science-users/170/simulated-data-products/ska-low-eor. It is a simulation, not an observation. The page states no licence and asks users to refer to the dataset papers.

## Decision

- The UI labels it "Simulated 21 cm lightcone (SKA Science Data Challenge 3a, noise-free model)".
- A credit line links to the SKAO page and cites Bonaldi et al. (2025), arXiv:2503.11740.
- The repo does not redistribute the raw file; it records the source URL and checksum.

## Consequences

- Astronomers on the panel see the data described accurately.
- If the source link changes, the download step must be updated.
