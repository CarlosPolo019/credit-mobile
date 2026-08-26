# Auth Feature

## Purpose
- Exponer operaciones de autenticacion.

## Key Files -> Role
- `api.ts`: requests de login y registro al backend.

## External Deps
- `shared/api/client.ts`

## Risks / TODOs
- No almacenar credenciales.
- Mantener contrato con `/api/v1/auth/login` usando `{ username, password }`; `username` puede ser cedula registrada o usuario demo.
- Mantener contrato con `/api/v1/auth/register` usando `{ fullName, document, password }`.
