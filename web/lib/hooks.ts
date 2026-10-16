/**
 * Data hooks — TanStack Query wrappers for the dataset metadata (GraphQL) and
 * the processed volume (binary REST route). Loading and error states are the
 * standard query states. The volume never changes for a given id (immutable
 * cache headers, ADR 0026), so it is never refetched.
 */
import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-request";
import { DatasetQuery } from "@/lib/queries";

export const datasetKey = (id: string) => ["dataset", id] as const;
export const volumeKey = (id: string) => ["volume", id] as const;

export class VolumeRequestError extends Error {
  constructor(readonly status: number) {
    super(`Volume request failed with ${status}`);
    this.name = "VolumeRequestError";
  }
}

export async function fetchVolume(
  id: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Uint8Array> {
  const response = await fetchImpl(`/data/volume/${encodeURIComponent(id)}`);
  if (!response.ok) throw new VolumeRequestError(response.status);
  return new Uint8Array(await response.arrayBuffer());
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: datasetKey(id),
    queryFn: async () => (await graphqlRequest(DatasetQuery, { id })).dataset,
  });
}

export function useVolume(id: string) {
  return useQuery({
    queryKey: volumeKey(id),
    queryFn: () => fetchVolume(id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
