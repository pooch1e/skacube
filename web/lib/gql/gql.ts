/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  query Dataset($id: String!) {\n    dataset(id: $id) {\n      id\n      title\n      unit\n      sourceUrl\n      citation\n      volumeSha256\n      shape {\n        ra\n        dec\n        frequency\n      }\n      axes {\n        name\n        unit\n        start\n        step\n        length\n        redshift {\n          start\n          end\n        }\n      }\n      stretch {\n        limitK\n        softeningK\n        zeroByte\n      }\n      header {\n        key\n        value\n      }\n    }\n  }\n": typeof types.DatasetDocument;
};
const documents: Documents = {
  "\n  query Dataset($id: String!) {\n    dataset(id: $id) {\n      id\n      title\n      unit\n      sourceUrl\n      citation\n      volumeSha256\n      shape {\n        ra\n        dec\n        frequency\n      }\n      axes {\n        name\n        unit\n        start\n        step\n        length\n        redshift {\n          start\n          end\n        }\n      }\n      stretch {\n        limitK\n        softeningK\n        zeroByte\n      }\n      header {\n        key\n        value\n      }\n    }\n  }\n":
    types.DatasetDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Dataset($id: String!) {\n    dataset(id: $id) {\n      id\n      title\n      unit\n      sourceUrl\n      citation\n      volumeSha256\n      shape {\n        ra\n        dec\n        frequency\n      }\n      axes {\n        name\n        unit\n        start\n        step\n        length\n        redshift {\n          start\n          end\n        }\n      }\n      stretch {\n        limitK\n        softeningK\n        zeroByte\n      }\n      header {\n        key\n        value\n      }\n    }\n  }\n",
): typeof import("./graphql").DatasetDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
