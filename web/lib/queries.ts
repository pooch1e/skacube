/**
 * GraphQL documents used by the web app. `pnpm codegen` turns each into a
 * typed document in lib/gql/.
 */
import { graphql } from "@/lib/gql";

export const DatasetQuery = graphql(`
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
`);
