# Credits Feature

## Purpose
- Exponer operaciones REST de creditos.

## Key Files -> Role
- `api.ts`: create/list con filtros y sort.

## External Deps
- `shared/api/client.ts`
- `entities/credit/validation.ts`

## Risks / TODOs
- No acceder a Firestore directo.
- Preservar allowlist de filtros y orden.
