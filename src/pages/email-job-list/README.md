# Email Job List Page

## Purpose
- Tab "Correos" (5to tab, solo `ADMIN`, ver `app/MainTabs.tsx`): ver el estado de las notificaciones de crédito (`PENDING`, `PROCESSING`, `SENT`, `RETRY`, `FAILED`) y el último error cuando falla un envío.
- Filtrar por estado (chips) y por texto libre (cliente o destinatario).

## Acceso
- Solo `session.user.role === "ADMIN"` (hoy, únicamente Carlos Escorcia): `MainTabs.tsx` ni siquiera monta este `Tab.Screen` para otra cuenta, así que en la práctica no hay forma de llegar acá sin el rol — a diferencia de Clientes/Dashboard (accesos desde Home, sin tab propio), este SÍ es un tab, no una pantalla empujada. El guard interno (`if (!isAdmin) navigation.navigate("Home")`) es una segunda línea de defensa por si el rol cambiara con el componente ya montado.
- El backend también lo exige: `GET /api/v1/email-jobs` requiere `ROLE_ADMIN` (`SecurityConfig`) — un token `USER` recibe `403` aunque llegue a esta pantalla, igual que `credit-web`.

## Key Files -> Role
- `EmailJobListPage.tsx`: filtros (debounce en texto, chips de estado), paginación en el cliente (6 por página) sobre el resultado ya filtrado por el backend.

## External Deps
- `features/email-jobs/api.ts` (`listEmailJobs`)
- `entities/credit/format.ts` (`formatCurrency`, `formatDate`)
- `entities/session/SessionContext.tsx`

## Risks / TODOs
- Cambiar de filtro/estado vuelve a la página 1.
- `lastError` es un solo string que el backend sobreescribe en cada intento; no hay historial por intento (igual que `credit-web`).
