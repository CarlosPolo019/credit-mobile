# Credit List Page

## Purpose
- Consultar creditos activos con filtros y ordenamiento.

## Key Files -> Role
- `CreditListPage.jsx`: filtros, sort, loading, empty y errores.

## External Deps
- `features/credits/api.js`
- `entities/credit/format.js`

## Risks / TODOs
- Usar solo sort fields permitidos: `createdAt`, `amount`.
- Manejar sesion expirada via interceptor global.

