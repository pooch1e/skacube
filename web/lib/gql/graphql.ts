/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type DatasetQueryVariables = Exact<{
  id: string;
}>;

export type DatasetQuery = {
  dataset: {
    id: string;
    title: string;
    unit: string;
    sourceUrl: string;
    citation: string;
    volumeSha256: string;
    shape: { ra: number; dec: number; frequency: number };
    axes: Array<{
      name: string;
      unit: string;
      start: number | null;
      step: number | null;
      length: number;
      redshift: { start: number | null; end: number | null } | null;
    }>;
    stretch: { limitK: number | null; softeningK: number | null; zeroByte: number };
    header: Array<{ key: string; value: string }>;
  } | null;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>["__apiType"]>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const DatasetDocument = new TypedDocumentString(`
    query Dataset($id: String!) {
  dataset(id: $id) {
    id
    title
    unit
    sourceUrl
    citation
    volumeSha256
    shape {
      ra
      dec
      frequency
    }
    axes {
      name
      unit
      start
      step
      length
      redshift {
        start
        end
      }
    }
    stretch {
      limitK
      softeningK
      zeroByte
    }
    header {
      key
      value
    }
  }
}
    `) as unknown as TypedDocumentString<DatasetQuery, DatasetQueryVariables>;
