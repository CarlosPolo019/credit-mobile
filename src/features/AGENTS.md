# Features

## Purpose
- Encapsular capacidades de usuario y llamadas API por caso de uso.

## Key Files -> Role
- `auth/api.ts`: login y registro.
- `credits/api.ts`: crear/listar creditos.

## External Deps
- `shared/api/client.ts`

## Risks / TODOs
- No mezclar UI dentro de features.
- Normalizar filtros antes de enviarlos.
