# Credit Detail Page

## Purpose
- Ver el detalle de un credito, editarlo, eliminarlo, verlo en PDF y ver el historial de auditoria.

## Key Files -> Role
- `CreditDetailPage.tsx`: carga `getCredit` + `getCreditAudit`, botones Editar/Eliminar/Ver PDF; recarga al volver de `CreditEdit` (listener de `focus`).
- `CreditEditPage.tsx`: carga el credito y reusa `credit-create/CreditForm.tsx` en `mode="edit"`; al confirmar llama `updateCredit` y vuelve al detalle.
- `DeleteCreditSheetContent.tsx`: bottom sheet de confirmacion de borrado.
- `CreditAuditHistory.tsx`: lista el historial (`CreditAuditEntry[]`), muestra quien y cuando, y el diff campo por campo (o "Eliminado" sin diff).

## External Deps
- `features/credits/api.ts` (`getCredit`, `updateCredit`, `deleteCredit`, `getCreditAudit`)
- `features/credits/pdf.ts` (`openCreditPdf`)
- `entities/session/SessionContext.tsx` (token para armar la URL del PDF)
- `shared/ui` (`BottomSheetModal`, `Banner`, `ErrorMessage`, `Screen`)

## Risks / TODOs
- El Comercial nunca es editable desde este formulario.
- Ver PDF exige sesion con token; si no hay token, `openCreditPdf` lanza antes de abrir el navegador.
- Mantener el historial de auditoria sincronizado con el detalle (recargar ambos al volver de editar).
