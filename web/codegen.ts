/**
 * GraphQL Codegen config — client types from the committed API schema
 * (ADR 0018). Output in lib/gql/ is committed; the contract CI job fails if
 * regenerating it, or re-exporting the schema, changes anything.
 */
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/schema.graphql",
  documents: ["lib/**/*.ts", "!lib/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    "lib/gql/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
        enumsAsTypes: true,
      },
      presetConfig: { fragmentMasking: false },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
