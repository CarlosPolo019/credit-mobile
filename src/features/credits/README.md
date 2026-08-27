# Credits Feature

## Purpose
- Exponer operaciones REST de creditos.

## Key Files -> Role
- `api.ts`: `createCredit`, `estimateCredit` (`POST /credits/estimate`, cuota/total sin guardar), `listCredits` (filtros y sort), `getCredit`, `updateCredit`, `deleteCredit`, `getCreditAudit`, `listClients` (`GET /api/v1/clients`, usado por el autocomplete de cedula en `CreditForm`).
- `pdf.ts`: `openCreditPdf` — abre el PDF del backend (`GET /credits/{id}/pdf`) directo en el navegador del sistema via `Linking.openURL`, con el token como query param (`?token=...`, ver `creditPdfUrl`) porque un tab de navegador no puede mandar el header `Authorization`. Reemplaza el flujo anterior de descargar+compartir (`react-native-blob-util` + `react-native-share`), que fallaba de forma intermitente en dispositivos reales ("Download Interrupted").
- `offlineQueue.ts`: cola local de creditos pendientes de sincronizar, persistida en `AsyncStorage` (`enqueueCredit`, `listQueuedCredits`, `countPendingAndFailed`, `markQueuedCreditSyncing`, `markQueuedCreditFailed`, `removeQueuedCredit`). Cada item: `{ id, payload, createdAt, attempts, status: "pending" | "syncing" | "failed", lastError }`.
- `offlineSync.ts`: `syncQueuedCredits` — recorre la cola y llama a `createCredit` por cada item; si funciona lo saca de la cola, si falla lo marca `failed` con el mensaje de error saneado. Un item fallido no bloquea a los demas.

## External Deps
- `shared/api/client.ts`
- `entities/credit/validation.ts`
- `@react-native-async-storage/async-storage` (solo en `offlineQueue.ts`)

## Risks / TODOs
- No acceder a Firestore directo.
- Preservar allowlist de filtros y orden.
- `pdf.ts` no usa el cliente Axios ni descarga nada en el dispositivo: solo arma la URL y la abre con `Linking`.
- Solo creacion soporta cola offline; editar/eliminar/PDF requieren internet (`shared/network/useNetworkStatus`). Ver `knowledge/credits/current-credit-offline-queue-flow.md`.
- Sin idempotencia remota: si el usuario reintenta sincronizar dos veces un item que ya se creo pero fallo al removerse de la cola, se duplicaria en el backend — riesgo aceptado en esta version (fuera de alcance segun el plan).
