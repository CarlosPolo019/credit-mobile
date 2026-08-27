# Credit Create Page

## Purpose
- Registrar un credito completo contra backend.

## Key Files -> Role
- `CreditCreatePage.tsx`: wrapper delgado (header + banner de exito) sobre `CreditForm` en modo `create`. Sin internet, no llama a `createCredit`: encola el credito con `enqueueCredit` y muestra el mensaje de exito offline.
- `CreditForm.tsx`: formulario (cedula primero, sin campo Comercial visible), validacion, pide la estimacion al backend y orquesta el sheet de confirmacion. Compartido con `credit-detail/CreditEditPage.tsx` (`mode="edit"`). En modo `create` sin internet, salta la llamada a `estimateCredit` y abre el sheet igual (con `estimate = null`) para que la creacion offline sea alcanzable; en modo `edit` siempre pide la estimacion (editar requiere internet).
- `CreditConfirmSheetContent.tsx`: bottom sheet de confirmacion (resumen + cuota/total estimados, recibidos por props). `monthlyPayment`/`totalToPay` son `number | null`; si son `null` (creacion offline) muestra "No disponible sin conexión" en vez de romper.

## External Deps
- `entities/credit/validation.ts`
- `features/credits/api.ts` (`createCredit`, `estimateCredit`)
- `features/credits/offlineQueue.ts` (`enqueueCredit`)
- `shared/network/NetworkStatusContext.tsx`
- `shared/ui` (`BottomSheetModal`)

## Flujo
1. El usuario llena el formulario; al enviar, `CreditForm` valida localmente. Si hay internet, pide la cuota/total estimados a `estimateCredit` (`POST /credits/estimate`) antes de abrir el sheet — el backend no guarda nada en este paso. Si no hay internet (solo en modo `create`), abre el sheet directo, sin estimacion.
2. El sheet muestra cliente, cedula, Comercial (de la sesion), valor, tasa, plazo y la cuota/total (o "No disponible sin conexión" si no se pudo estimar).
3. "Confirmar y registrar" llama a `onSubmit`: con internet, `CreditCreatePage` llama a `createCredit`; sin internet, encola el credito localmente (`enqueueCredit`) y lo deja para `HomePage`/`ProfileSheetContent` lo sincronicen. "Revisar datos" cierra el sheet sin enviar y conserva lo escrito.

## Risks / TODOs
- Backend genera fecha oficial.
- Frontend valida UX; backend es la autoridad.
- La cuota/total estimados los calcula el backend (misma formula que `CreditResponse` y el PDF); no reintroducir un calculo local aqui.
- Solo la creacion funciona offline; editar/eliminar/PDF siguen requiriendo internet (ver `knowledge/credits/current-credit-offline-queue-flow.md`).
