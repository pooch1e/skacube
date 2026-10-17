/**
 * graphqlRequest — the thin GraphQL wrapper from ADR 0009. POSTs a typed
 * document to the same-origin `/graphql` route (proxied to Flask by Next
 * rewrites) and returns its typed `data`, throwing on HTTP or GraphQL errors
 * so TanStack Query reports them as query errors.
 */
import type { TypedDocumentString } from "@/lib/gql/graphql";

export class GraphQLRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

type GraphQLResponse<TResult> = {
  data?: TResult | null;
  errors?: { message: string }[];
};

export async function graphqlRequest<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  fetchImpl: typeof fetch = fetch,
): Promise<TResult> {
  const response = await fetchImpl("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: document.toString(), variables }),
  });
  if (!response.ok) {
    throw new GraphQLRequestError(
      `GraphQL request failed with ${response.status}`,
      response.status,
    );
  }
  const body = (await response.json()) as GraphQLResponse<TResult>;
  if (body.errors?.length) {
    throw new GraphQLRequestError(body.errors.map((e) => e.message).join("; "));
  }
  if (body.data == null) {
    throw new GraphQLRequestError("GraphQL response had no data");
  }
  return body.data;
}
