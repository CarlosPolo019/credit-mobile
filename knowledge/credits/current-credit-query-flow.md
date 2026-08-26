# Flow: Credit Query

## Estado
- `active`

## Proposito
- Consultar creditos activos con filtros y ordenamiento.

## Participantes
- `pages/credit-list/CreditListPage.jsx`
- `features/credits/api.js`
- `entities/credit/format.js`
- `entities/credit/validation.js`

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant Page
  participant Feature
  participant Backend
  User->>Page: Open list or change filters
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
- Prueba manual: filtrar por nombre/documento/comercial y alternar sort fecha/monto.

