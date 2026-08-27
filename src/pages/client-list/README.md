# Client List Page

## Purpose
- Directorio de solo lectura: cédula + nombre de todos los clientes.
- No hay crear/editar/eliminar — los clientes se derivan automáticamente al registrar/editar créditos (backend, `ClientService.upsert`).

## Acceso
- Solo `session.user.role === "ADMIN"` (hoy, únicamente Carlos Escorcia). No aparece en `HomePage` para otras cuentas; si de todos modos se navega ahí, redirige hacia atrás (`navigation.goBack()`) — esta pantalla es siempre una pantalla empujada desde el tab Home, no un tab propio, así que "atrás" siempre existe.
- El endpoint (`GET /api/v1/clients`) no exige rol en el backend a propósito — lo usa también el autocomplete del formulario de créditos, que usan todas las cuentas. El permiso de admin es solo de esta pantalla, no del dato, igual que `credit-web`.

## Key Files -> Role
- `ClientListPage.tsx`: fetch de `listClients()` (una vez), filtro de texto local (cédula o nombre), paginación en el cliente (6 por página, botones Anterior/Siguiente).

## External Deps
- `features/credits/api.ts` (`listClients`)
- `entities/session/SessionContext.tsx`

## Risks / TODOs
- Mismo dataset que el autocomplete de `CreditForm`; no duplicar la llamada en un cache propio.
