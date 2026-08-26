# Flow: Credit Detail (Ver, Editar, Eliminar, Auditoria, PDF)

## Estado
- `active`

## Proposito
- Ver el detalle completo de un credito, editarlo, eliminarlo, exportarlo a PDF y ver quien lo cambio.

## Participantes
- `pages/credit-list/CreditListPage.tsx` (la fila navega a `CreditDetail`)
- `pages/credit-detail/CreditDetailPage.tsx`
- `pages/credit-detail/CreditEditPage.tsx`
- `pages/credit-create/CreditForm.tsx` (compartido entre crear y editar, `mode` prop)
- `pages/credit-detail/DeleteCreditSheetContent.tsx`
- `pages/credit-detail/CreditAuditHistory.tsx`
- `features/credits/api.ts`
- `features/credits/pdf.ts`
- `entities/session/SessionContext.tsx` (token para la descarga del PDF)

## Flujo
```mermaid
sequenceDiagram
  participant List as CreditListPage
  participant Detail as CreditDetailPage
  participant Edit as CreditEditPage
  participant Feature as features/credits
  participant Backend

  List->>Detail: navigate("CreditDetail", { creditId })
  Detail->>Feature: getCredit(id) + getCreditAudit(id)
  Feature->>Backend: GET /credits/{id} · GET /credits/{id}/audit
  Backend-->>Detail: Credit + CreditAuditEntry[]

  User->>Detail: Editar
  Detail->>Edit: navigate("CreditEdit", { creditId })
  Edit->>Feature: getCredit(id) (datos frescos)
  User->>Edit: CreditForm (mode=edit) -> Confirmar cambios
  Edit->>Feature: updateCredit(id, payload)
  Feature->>Backend: PUT /credits/{id}
  Edit->>Detail: goBack() (el focus listener recarga credito + auditoria)

  User->>Detail: Eliminar
  Detail->>Feature: deleteCredit(id)
  Feature->>Backend: DELETE /credits/{id}
  Detail->>List: goBack()

  User->>Detail: Exportar PDF
  Detail->>Feature: downloadAndShareCreditPdf(id, token)
  Feature->>Backend: GET /credits/{id}/pdf (Authorization: Bearer, via react-native-blob-util)
  Feature->>Feature: react-native-share abre/comparte el archivo descargado
```

## Decisiones
- El PDF se genera en el backend (OpenPDF), no en el dispositivo: evita una libreria nativa de render de PDF. `pdf.ts` solo descarga el binario (con el token, porque un link plano no puede llevar el header `Authorization`) y lo comparte.
- `CreditForm.tsx` es un solo componente para crear y editar (`mode` prop), igual que `credit-web/pages/credits/CreditForm.jsx` — evita mantener dos formularios casi identicos.
- El comercial nunca es editable, ni en el formulario ni en el backend (`PUT` lo ignora si viniera).
- El historial de auditoria se recarga automaticamente al volver de `CreditEdit` (listener de `focus` en `CreditDetailPage`), no solo al montar.
- No hay una columna de acciones tipo tabla en `CreditListPage` (no es idiomatico en una lista mobile): tocar la fila lleva al detalle, y editar/eliminar viven ahi.

## Errores
- Credito inexistente/inactivo: `ErrorMessage` de pagina completa con boton para volver.
- Fallo al eliminar o exportar PDF: `Banner` de error en el detalle, no bloquea la pantalla.
- Sesion sin token al exportar PDF: `downloadAndShareCreditPdf` lanza antes de llamar a la red.

## Validacion
- `npm run typecheck`
- `npm run lint`
- `npm test`
- Prueba manual en dispositivo: listar -> tocar un credito -> editar -> confirmar -> ver la entrada nueva en el historial -> exportar PDF (se abre el share sheet) -> eliminar (confirmar) -> vuelve al listado.
