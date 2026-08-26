# Flow: Credit Query

## Estado
- `active`

## Proposito
- Consultar creditos activos con filtros y ordenamiento.

## Participantes
- `pages/credit-list/CreditListPage.tsx`
- `pages/credit-list/CreditFiltersSheetContent.tsx`
- `features/credits/api.ts`
- `entities/credit/format.ts`
- `entities/credit/validation.ts`
- `shared/ui/BottomSheetModal.tsx`

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant Page
  participant Feature
  participant Backend
  User->>Page: Open list, search or change bottom-sheet filters
  Page->>Feature: listCredits(filters)
  Feature->>Backend: GET /api/v1/credits
  Backend-->>Feature: Active credits
  Feature-->>Page: Rows
```

## Errores
- Error de red: mostrar banner y conservar control de filtros.
- Sin resultados: mostrar estado vacio.
- Sesion expirada: volver al stack publico.

## Validacion
- `npm run typecheck`
- Prueba manual: filtrar por nombre/documento/comercial y alternar sort fecha/monto.
