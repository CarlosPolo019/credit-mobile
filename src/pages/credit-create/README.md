# Credit Create Page

## Purpose
- Registrar un credito completo contra backend.

## Key Files -> Role
- `CreditCreatePage.tsx`: formulario (cedula primero, sin campo Comercial visible) + validacion.
- `CreditConfirmSheetContent.tsx`: bottom sheet de confirmacion (resumen + cuota/total estimados) que se abre antes de llamar al backend.

## External Deps
- `entities/credit/validation.ts`
- `entities/credit/payment.ts`
- `features/credits/api.ts`
- `shared/ui` (`BottomSheetModal`)

## Flujo
1. El usuario llena el formulario; "Registrar credito" valida y abre el sheet de confirmacion (no llama al backend todavia).
2. El sheet muestra cliente, cedula, Comercial (de la sesion), valor, tasa, plazo y una cuota/total estimados (`estimateCreditPayment`, solo informativo, el backend no lo recibe).
3. "Confirmar y registrar" llama a `createCredit`; "Revisar datos" cierra el sheet sin enviar y conserva lo escrito.

## Risks / TODOs
- Backend genera fecha oficial.
- Frontend valida UX; backend es la autoridad.
- El calculo de cuota/total es una estimacion local (amortizacion francesa, tasa mensual); no se persiste.
