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

## Decisiones
- El filtro de "Comercial" es un select de chips (`FilterSection`, `wrap`), no texto libre: las opciones se arman a partir de los `salespersonName` distintos de un fetch inicial sin filtrar (no hay endpoint de lista de comerciales), guardado aparte de `credits` para que no se reduzca a una sola opcion una vez que ya hay un filtro aplicado.
- Tocar una fila navega a `CreditDetail`.

## Errores
- Error de red: mostrar banner y conservar control de filtros.
- Sin resultados: mostrar estado vacio.
- Sesion expirada: volver al stack publico.

## Validacion
- `npm run typecheck`
- Prueba manual: filtrar por nombre/documento/comercial y alternar sort fecha/monto.
