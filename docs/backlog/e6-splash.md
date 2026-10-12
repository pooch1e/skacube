# E6. Splash page

The first thing the panel sees, with the viewer as the hero. Content and layout still need UX decisions.

## S6.1 UX decisions (needs decision)

- [ ] T6.1.1 Grill session on splash content, sections and narrative; record as ADRs — M
- [ ] T6.1.2 Wireframe in the design canvas — M

## S6.2 Hero

As a visitor, I see the lightcone moving within seconds of the page opening.

Acceptance:
- Viewer is the hero; headline and one-sentence explanation of what it shows
- Splash is statically generated ([ADR 0011](../docs/adr/0011-app-router-client-viewer.md)); viewer loads client-side with a designed loading state

Tasks:
- [ ] T6.2.1 Hero layout and copy — M
- [ ] T6.2.2 Loading and error states — S

## S6.3 Story and provenance

As an astronomer, I see the data described accurately and credited.

Acceptance:
- Label: "Simulated 21 cm lightcone (SKA Science Data Challenge 3a, noise-free model)"
- Credit line linking the SKAO page and Bonaldi et al. (2025)
- Short explanation of absorption, emission and ionised bubbles

Tasks:
- [ ] T6.3.1 Provenance and credit block ([ADR 0017](../docs/adr/0017-dataset-provenance.md)) — S
- [ ] T6.3.2 Explainer section — M

## S6.4 About the build

As a hiring panel member, I can reach the repo, docs and ADRs from the page.

- [ ] T6.4.1 Footer with links to repo, design docs and author — S
