# Dependencies

| Layer | Choice | Record |
|---|---|---|
| Frontend | Next.js App Router, TypeScript (strict) | [0002](../adr/0002-typescript.md), [0011](../adr/0011-app-router-client-viewer.md) |
| Data fetching | TanStack Query + thin GraphQL wrapper | [0009](../adr/0009-tanstack-query.md) |
| 3D | react-three-fiber, drei, custom raymarch shader | [0010](../adr/0010-react-three-fiber.md) |
| Backend | Flask, Strawberry GraphQL, astropy, numpy | [0005](../adr/0005-flask-backend.md) |
| API shape | GraphQL for metadata, REST for binary | [0008](../adr/0008-graphql-metadata-rest-binary.md) |
| Tooling | uv, ruff, mypy, pytest · pnpm, ESLint, Prettier, Vitest, Playwright | [0012](../adr/0012-tooling.md) |
| UI primitives | shadcn/ui, Tailwind CSS | [0023](../adr/0023-shadcn-tailwind.md) |
| Fonts | Big Shoulders Display, Hanken Grotesk, Martian Mono | [Design system](../design/README.md) |

