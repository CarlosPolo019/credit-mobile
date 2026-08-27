# Email Jobs Feature

## Purpose
- Exponer la consulta de trabajos de notificacion por correo (solo lectura).

## Key Files -> Role
- `api.ts`: `listEmailJobs` (`GET /api/v1/email-jobs`, filtros de estado/busqueda/orden).

## External Deps
- `shared/api/client.ts`

## Risks / TODOs
- Endpoint admin-only en el backend (`ROLE_ADMIN`); un token `USER` recibe 403. La pantalla que lo consume (`pages/email-job-list`) ya se auto-restringe por rol antes de llamar esto.
