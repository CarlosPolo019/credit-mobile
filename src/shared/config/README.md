# Shared Config

## Purpose
- Resolver configuracion runtime del cliente mobile.

## Key Files -> Role
- `env.ts`: exporta config usada por la app.
- `generated.env.ts`: generado por `scripts/write-mobile-config.js`.

## External Deps
- Variable `CREDIT_API_BASE_URL` antes de build/start.

## Risks / TODOs
- No editar `generated.env.ts` manualmente.
- Release debe apuntar a backend HTTPS real.
