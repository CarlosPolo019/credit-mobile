# Credit Detail Page

## Purpose
- Ver el detalle de un credito, editarlo, eliminarlo, exportarlo a PDF y ver el historial de auditoria.

## Key Files -> Role
- `CreditDetailPage.tsx`: carga `getCredit` + `getCreditAudit`, botones Editar/Eliminar/Exportar PDF; recarga al volver de `CreditEdit` (listener de `focus`).
- `CreditEditPage.tsx`: carga el credito y reusa `credit-create/CreditForm.tsx` en `mode="edit"`; al confirmar llama `updateCredit` y vuelve al detalle.
- `DeleteCreditSheetContent.tsx`: bottom sheet de confirmacion de borrado.
- `CreditAuditHistory.tsx`: lista el historial (`CreditAuditEntry[]`), muestra quien y cuando, y el diff campo por campo (o "Eliminado" sin diff).

## External Deps
- `features/credits/api.ts` (`getCredit`, `updateCredit`, `deleteCredit`, `getCreditAudit`)
- `features/credits/pdf.ts` (`downloadAndShareCreditPdf`)
- `entities/session/SessionContext.tsx` (token para la descarga del PDF)
- `shared/ui` (`BottomSheetModal`, `Banner`, `ErrorMessage`, `Screen`)

## Risks / TODOs
- El Comercial nunca es editable desde este formulario.
- Exportar PDF exige sesion con token; si no hay token, `downloadAndShareCreditPdf` lanza antes de llamar a la red.
- Mantener el historial de auditoria sincronizado con el detalle (recargar ambos al volver de editar).
