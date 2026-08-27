# Credit List Page

## Purpose
- Tab "Créditos": consultar creditos activos con filtros y ordenamiento.

## Key Files -> Role
- `CreditListPage.tsx`: filtros, sort, loading, empty, errores; toca una fila para ir a `CreditDetail` (pantalla empujada encima de los tabs, fuera de `MainTabs`). Pagina en el cliente (6 por pagina, `SectionList` no crece infinito) — cambiar de filtro/orden vuelve a la pagina 1. Al ser un tab, no tiene boton de "volver"; el bottom padding extra (`styles.listContent`/`pb-24` en el pie de paginacion) evita que el `FloatingTabBar` flotante tape la ultima fila o los controles de paginacion.
- `CreditFiltersSheetContent.tsx`: contenido del bottom sheet de filtros. "Comercial" es un select de chips (no texto libre), con las opciones armadas a partir de los `salespersonName` distintos de un fetch inicial sin filtrar.

## External Deps
- `features/credits/api.ts`
- `entities/credit/format.ts`
- `shared/ui/BottomSheetModal.tsx`

## Risks / TODOs
- Usar solo sort fields permitidos: `createdAt`, `amount`.
- Manejar sesion expirada via interceptor global.
- No reducir las opciones de "Comercial" a partir de la lista ya filtrada (se guardan aparte para no perder opciones al aplicar un filtro).
