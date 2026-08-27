# Dashboard Page

## Purpose
- Vista agregada de solo lectura, equivalente movil al "Dashboard" de `credit-web`: créditos por comercial, créditos activos, monto total solicitado, ganancia total estimada, tasa de interés promedio y correos por estado.
- No hay un endpoint dedicado en el backend — todo se calcula en el cliente a partir de las mismas listas que ya usan `CreditListPage` y `EmailJobListPage`.

## Acceso
- Solo `session.user.role === "ADMIN"` (hoy, únicamente Carlos Escorcia). No aparece en `HomePage` para otras cuentas; si de todos modos se navega ahí, redirige a `Home` (`navigation.replace`), mismo patrón que `ClientListPage`/`EmailJobListPage`.
- `GET /api/v1/email-jobs` lo exige también el backend (403 para `USER`); `GET /api/v1/credits` no tiene esa restricción (el permiso de admin es solo de esta pantalla, no del dato).

## Key Files -> Role
- `DashboardPage.tsx`:
  - Carga `listCredits(...)` y `listEmailJobs(...)` en paralelo (`Promise.all`) al montar, con `{ clientName: "", clientDocument: "", salesperson: "", sortBy: "createdAt", direction: "desc" }` / `{ status: "", search: "", sortBy: "createdAt", direction: "desc" }` — ambos endpoints devuelven el dataset completo (sin paginación de servidor), misma suposición que `CreditListPage`/`EmailJobListPage` ya hacen.
  - Agregaciones (`useMemo`): créditos por comercial (`salespersonName`, fallback `"Sin comercial"`, orden descendente), total de créditos activos, monto total solicitado (`sum(amount)`), ganancia total estimada (`sum(estimatedTotalToPay) - sum(amount)`, usa el valor del backend, no recalcula amortización), tasa de interés promedio, y correos agrupados por estado (solo estados con conteo > 0).
  - UI: 4 tarjetas KPI en grilla 2x2 (`w-[48%]`), lista de barras horizontales por comercial (`View` con `width: ${pct}%`, corona en el líder), y una barra segmentada + leyenda para correos por estado (Views planas, sin SVG — más simple y robusto que un donut con `react-native-svg` para este caso).

## External Deps
- `features/credits/api.ts` (`listCredits`)
- `features/email-jobs/api.ts` (`listEmailJobs`)
- `entities/credit/format.ts` (`formatCurrency`)
- `entities/session/SessionContext.tsx`
- `shared/ui` (`Screen`, `ErrorMessage`, `SectionHeader`, `colors`)
- `lucide-react-native` (`ArrowLeft`, `Crown`, `ListChecks`, `Percent`, `TrendingUp`, `Wallet`)

## Risks / TODOs
- Igual que `CreditListPage`/`EmailJobListPage`: si el backend algún día pagina estos endpoints en servidor, las agregaciones quedarían incompletas — hoy es una suposición confirmada, no un supuesto nuevo.
- Los colores de la barra segmentada de correos son tonos sólidos de la misma familia que los pills de `EmailJobListPage` (`STATUS_STYLES`), no valores nuevos fuera de la paleta.
