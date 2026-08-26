# Shared Config

## Purpose
- Resolver configuracion runtime del cliente mobile.

## Key Files -> Role
- `env.js`: exporta config usada por la app.
- `generated.env.js`: generado por `scripts/write-mobile-config.js`.

## External Deps
- Variable `CREDIT_API_BASE_URL` antes de build/start.

## Risks / TODOs
- No editar `generated.env.js` manualmente.
- Release debe apuntar a backend HTTPS real.

