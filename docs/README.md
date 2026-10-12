# Skycube design docs

Skycube is a portfolio web app for exploring radio astronomy FITS data cubes in 3D. These docs are the design document for it: what it is, how it fits together, and why each decision was made.

Status: **planning**. Sections marked _Open_ are still being decided.

## Start here

- [Overview](overview.md): purpose, audience, goals and non-goals
- [Open questions](open-questions.md): decisions still to make

## Architecture

- [Architecture overview](architecture/README.md): components and how they connect
- [Data flow](architecture/data-flow.md): from FITS file to pixels on screen
- [Dependencies](architecture/dependencies.md): languages, frameworks and libraries
- [Production ingest](architecture/production-ingest.md): how hosting and ingest would work without local processing
- [SDLC](sdlc.md): repo, branching, testing, CI/CD, releases

## Design

- [Design system](design/README.md): Skycube tokens, type and components

## Planning

- [Backlog](../backlog/README.md): epics, stories and tasks

## Decisions

- [Architecture decision records](adr/README.md)

## Background

- [FITS primer](background/fits.md): how FITS files work
- [Dataset](background/dataset.md): the EoR 21 cm cube
