# Credit List Page

## Purpose
- Consultar creditos activos con filtros y ordenamiento.

## Key Files -> Role
- `CreditListPage.tsx`: filtros, sort, loading, empty y errores.
- `CreditFiltersSheetContent.tsx`: contenido del bottom sheet de filtros.

## External Deps
- `features/credits/api.ts`
- `entities/credit/format.ts`
- `shared/ui/BottomSheetModal.tsx`

## Risks / TODOs
- Usar solo sort fields permitidos: `createdAt`, `amount`.
- Manejar sesion expirada via interceptor global.
