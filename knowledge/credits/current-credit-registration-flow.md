# Flow: Credit Registration

## Estado
- `active`

## Proposito
- Registrar un credito completo y dejar que el backend encole el correo.

## Participantes
- `pages/credit-create/CreditCreatePage.jsx`
- `entities/credit/validation.js`
- `features/credits/api.js`
- `shared/api/client.js`

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant Page
  participant Feature
  participant Backend
  User->>Page: Fill credit form
  Page->>Page: Validate input
  Page->>Feature: createCredit(payload)
  Feature->>Backend: POST /api/v1/credits
  Backend-->>Feature: CreditResponse
  Feature-->>Page: Success
```

## Errores
- Validacion local: mostrar mensajes antes de llamar API.
- Error backend/red: mostrar banner de error.
- Sesion expirada: interceptor limpia sesion.

## Validacion
- `npm run lint`
- `npm test`
- Prueba manual: crear credito y confirmar mensaje de exito.

