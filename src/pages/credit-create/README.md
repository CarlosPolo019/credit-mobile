# Credit Create Page

## Purpose
- Registrar un credito completo contra backend.

## Key Files -> Role
- `CreditCreatePage.tsx`: wrapper delgado (header + banner de exito) sobre `CreditForm` en modo `create`.
- `CreditForm.tsx`: formulario (cedula primero, sin campo Comercial visible), validacion, pide la estimacion al backend y orquesta el sheet de confirmacion. Compartido con `credit-detail/CreditEditPage.tsx` (`mode="edit"`).
- `CreditConfirmSheetContent.tsx`: bottom sheet de confirmacion (resumen + cuota/total estimados, recibidos por props).

## External Deps
- `entities/credit/validation.ts`
- `features/credits/api.ts` (`createCredit`, `estimateCredit`)
- `shared/ui` (`BottomSheetModal`)

## Flujo
1. El usuario llena el formulario; al enviar, `CreditForm` valida localmente y pide la cuota/total estimados a `estimateCredit` (`POST /credits/estimate`) antes de abrir el sheet — el backend no guarda nada en este paso.
2. El sheet muestra cliente, cedula, Comercial (de la sesion), valor, tasa, plazo y la cuota/total que devolvio el backend.
3. "Confirmar y registrar" llama a `createCredit`; "Revisar datos" cierra el sheet sin enviar y conserva lo escrito.

## Risks / TODOs
- Backend genera fecha oficial.
- Frontend valida UX; backend es la autoridad.
- La cuota/total estimados los calcula el backend (misma formula que `CreditResponse` y el PDF); no reintroducir un calculo local aqui.
