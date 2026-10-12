# Production ingest: without local processing

The demo processes one file on a laptop and commits the output ([ADR 0013](../adr/0013-one-time-ingest.md), [ADR 0021](../adr/0021-data-storage.md)). This page answers: *how would it work for real data, at real scale?*

## Short answer

> Files land in object storage, and that event queues a containerised ingest job. The job runs the same ingest code, streaming the cube in chunks, and writes multi-resolution files back to storage. A catalogue database tracks each dataset's status and file locations. The API reads the catalogue and hands the browser CDN URLs, so large bytes never pass through Flask. At SKA scale this UI wouldn't own ingest at all: it would be a client of the observatory's data services.

## Pipeline

```
upload (signed URL) ──► raw bucket ──event──► queue ──► ingest job (container)
                                                          │ same code as `flask ingest`
                                                          │ chunked, memory-bounded
                                                          ▼
                         catalogue DB ◄── status ── processed bucket (+ CDN)
                              ▲                          ▲
                        Flask GraphQL ── returns URLs ───┘
                              ▲
                           browser
```

## The parts

1. **Upload**: the browser gets a signed URL and uploads straight to the bucket, resumable and in parts. Gigabytes never pass through the API.
2. **Raw storage**: object storage (GCS or S3), immutable, keyed by checksum. Re-uploading the same file is a no-op.
3. **Trigger**: an object-created notification goes onto a queue (Pub/Sub or SQS). A dead-letter queue catches repeated failures.
4. **Ingest job**: a container (Cloud Run Jobs, Kubernetes Job) running the existing ingest module.
   - It memory-maps the FITS file and processes it channel by channel, so memory stays bounded regardless of file size. Dask can handle files bigger than one machine.
   - It writes **multi-resolution** output: a 128³ preview, the 256³ volume, and full-resolution data in a chunked format (Zarr or tiled FITS) for slices and cutouts.
   - Output is keyed by `checksum + pipeline version`, so changing the stretch re-ingests cleanly.
5. **Catalogue**: Postgres holds one row per dataset: header, WCS, file locations, and status (`pending → processing → ready | failed`).
6. **API**: GraphQL lists datasets and their status from the catalogue, and returns file **URLs** rather than streaming bytes ([ADR 0026](../adr/0026-api-serves-volume.md) changes here). The UI polls for status, or a subscription pushes it.
7. **Serving**: a CDN serves processed files, cached forever because the keys are content hashes. Signed URLs cover proprietary data.
8. **Cutouts**: arbitrary regions come from a server-side cutout service reading the chunked store, so the browser never downloads a whole cube.

## Concerns to name

- **Idempotency and retries**: checksum keys, retry with backoff, a dead-letter queue.
- **Validation**: reject files with no image data or unsupported axes before doing heavy work.
- **Access control**: telescope data often has proprietary periods.
- **Observability**: job duration, failure rate, queue depth.
- **Cost**: cold storage for raw files, CDN egress for processed ones.

## In the SKA context

SKA data products are produced by the Science Data Processor and distributed to scientists through the SKA Regional Centre Network (SRCNet), using IVOA standards: ObsCore/TAP for discovery, DataLink, and SODA for cutouts. A real SKA-facing version of this viewer would **consume** those services instead of running its own ingest. It would query for a dataset, request a cutout at the resolution it needs, and render it. The ingest pipeline above is what you'd build for a standalone product.

## What carries over from the demo

- The ingest code is a pure module with tests; only its trigger and storage change.
- The API's GraphQL schema stays; resolvers read the catalogue instead of local files.
- The viewer is unchanged; it already loads a volume by URL.
