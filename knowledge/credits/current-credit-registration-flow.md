# Flow: Credit Registration

## Estado
- `active`

## Proposito
- Registrar un credito completo y dejar que el backend encole el correo.

## Participantes
- `pages/credit-create/CreditCreatePage.tsx`
- `pages/credit-create/CreditConfirmSheetContent.tsx`
- `entities/credit/validation.ts`
- `entities/credit/payment.ts`
- `features/credits/api.ts`
- `shared/api/client.ts`
- `shared/ui/BottomSheetModal.tsx`

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant Page
  participant ConfirmSheet
  participant Feature
  participant Backend
  User->>Page: Fill credit form (cedula primero, sin campo Comercial)
  Page->>Page: Validate input
  Page->>ConfirmSheet: present() con el payload validado
  ConfirmSheet->>ConfirmSheet: estimateCreditPayment (cuota/total estimados)
  User->>ConfirmSheet: Confirmar y registrar
  ConfirmSheet->>Feature: createCredit(payload)
  Feature->>Backend: POST /api/v1/credits
  Backend-->>Feature: CreditResponse
  Feature-->>Page: Success (sheet se cierra, formulario se limpia)
```

El paso de confirmacion es igual al de `credit-web` (`CreditConfirmDialog.jsx`): el Comercial se muestra ahi (trazabilidad), no en el formulario, porque ya viene de la sesion. Si `createCredit` falla, el sheet se cierra y el error se muestra en el `Banner` de la pagina.

## Errores
- Validacion local: mostrar mensajes antes de llamar API.
- Error backend/red: mostrar banner de error.
- Sesion expirada: interceptor limpia sesion.

## Validacion
- `npm run typecheck`
- `npm run lint`
- `npm test`
- Prueba manual: crear credito y confirmar mensaje de exito.
