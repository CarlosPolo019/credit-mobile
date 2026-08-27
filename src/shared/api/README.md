# Shared API

## Purpose
- Configurar Axios, token Bearer y manejo global de `401`.

## Key Files -> Role
- `client.ts`: instancia Axios, `configureApi`, interceptores. El interceptor de respuesta traduce un error sin `error.response` (sin conexion o timeout) a `"Sin conexión. Revisa internet e intenta de nuevo."` antes de aplicar el mensaje del backend.

## External Deps
- Axios.

## Risks / TODOs
- `baseURL` viene de `shared/config/env.ts`.
- No hardcodear tokens ni secretos.
