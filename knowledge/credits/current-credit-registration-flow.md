# Flow: Credit Registration

## Estado
- `active`

## Proposito
- Registrar un credito completo y dejar que el backend encole el correo.

## Participantes
- `pages/credit-create/CreditCreatePage.tsx` (wrapper delgado sobre `CreditForm` en modo `create`)
- `pages/credit-create/CreditForm.tsx` (formulario + orquestacion del sheet, compartido con `credit-edit`)
- `pages/credit-create/CreditConfirmSheetContent.tsx`
- `entities/credit/validation.ts`
- `features/credits/api.ts` (`createCredit`, `estimateCredit`, `listClients`)
- `shared/api/client.ts`
- `shared/ui/BottomSheetModal.tsx`

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant Form as CreditForm
  participant ConfirmSheet
  participant Feature
  participant Backend
  Form->>Feature: listClients() (al montar, solo modo create)
  Feature->>Backend: GET /api/v1/clients
  Backend-->>Form: listado completo de clientes
  User->>Form: Escribe la cedula (sugerencias filtran localmente, hasta 5)
  alt cedula ya existe
    User->>Form: Toca la sugerencia
    Form->>Form: autocompleta el nombre, campos quedan solo lectura
  else cedula nueva
    User->>Form: Completa nombre, valor, tasa, plazo
  end
  Form->>Form: Validate input
  Form->>Feature: estimateCredit(payload)
  Feature->>Backend: POST /api/v1/credits/estimate
  Backend-->>Form: cuota/total estimados
  Form->>ConfirmSheet: present() con el payload validado + la estimacion
  User->>ConfirmSheet: Confirmar y registrar
  ConfirmSheet->>Feature: createCredit(payload)
  Feature->>Backend: POST /api/v1/credits
  Backend->>Backend: sincroniza el cliente en clients (upsert)
  Backend-->>Feature: CreditResponse
  Feature-->>Form: Success (sheet se cierra, formulario se limpia)
```

El paso de confirmacion es igual al de `credit-web` (`CreditConfirmDialog.jsx`): el Comercial se muestra ahi (trazabilidad), no en el formulario, porque ya viene de la sesion. La cuota/total estimados los calcula el backend (`POST /credits/estimate`, misma formula que `CreditResponse.estimatedMonthlyPayment`/`estimatedTotalToPay` y el PDF) — no hay amortizacion calculada en el cliente, ni aqui ni en `credit-web`. Con internet, si `estimateCredit` falla se muestra un banner y no se abre el sheet; si `createCredit` falla, el sheet se cierra y el error se muestra en el `Banner` de la pagina.

**Autocomplete de cliente** (solo modo `create`): al montar, `CreditForm` llama `listClients()` una vez; mientras se tipea la cedula, filtra localmente (sin llamadas de red adicionales) y muestra hasta 5 sugerencias `cedula — nombre` debajo del campo. Tocar una autocompleta y deshabilita los 4 campos de nombre (solo lectura, sin edicion desde este flujo — igual que `credit-web`); si se borra o cambia la cedula despues, vuelve a modo "no encontrado" (campos vacios y editables). Si `listClients()` falla, el campo se comporta como un texto plano (no bloquea el registro). En modo `edit` no hay autocomplete.

**Sin internet** (solo en modo `create`): `CreditForm` salta `estimateCredit` y abre el sheet igual (cuota/total como "No disponible sin conexión"); al confirmar, `CreditCreatePage` encola el credito localmente en vez de llamar a `createCredit`. Detalle completo en `knowledge/credits/current-credit-offline-queue-flow.md`.

## Errores
- Validacion local: mostrar mensajes antes de llamar API.
- Fallo al estimar (con internet): banner de error, el sheet no se abre.
- Error backend/red al crear: mostrar banner de error.
- Sesion expirada: interceptor limpia sesion.

## Validacion
- `npm run typecheck`
- `npm run lint`
- `npm test`
- Prueba manual: crear credito y confirmar mensaje de exito.
