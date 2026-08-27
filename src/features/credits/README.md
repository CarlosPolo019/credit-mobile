# Credits Feature

## Purpose
- Exponer operaciones REST de creditos.

## Key Files -> Role
- `api.ts`: `createCredit`, `estimateCredit` (`POST /credits/estimate`, cuota/total sin guardar), `listCredits` (filtros y sort), `getCredit`, `updateCredit`, `deleteCredit`, `getCreditAudit`.
- `pdf.ts`: `downloadAndShareCreditPdf` — descarga el PDF del backend (`GET /credits/{id}/pdf`, con el token, via `react-native-blob-util`) y lo comparte con `react-native-share`.

## External Deps
- `shared/api/client.ts`
- `entities/credit/validation.ts`
- `react-native-blob-util`, `react-native-share` (solo en `pdf.ts`)

## Risks / TODOs
- No acceder a Firestore directo.
- Preservar allowlist de filtros y orden.
- `pdf.ts` no usa el cliente Axios: necesita un archivo binario, no JSON.
