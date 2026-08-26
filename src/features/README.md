# Features

## Purpose
- Encapsular capacidades de usuario y llamadas API por caso de uso.

## Key Files -> Role
- `auth/api.ts`: login y registro.
- `credits/api.ts`: crear/listar/obtener/editar/eliminar creditos, historial de auditoria.
- `credits/pdf.ts`: descarga el PDF del backend (`GET /credits/{id}/pdf`) y lo comparte; usa `react-native-blob-util` directo (no el cliente axios) porque necesita un archivo binario y no puede depender del interceptor de headers de `api/client.ts` para el share posterior.

## External Deps
- `shared/api/client.ts`
- `react-native-blob-util`, `react-native-share` (solo en `credits/pdf.ts`)

## Risks / TODOs
- No mezclar UI dentro de features.
- Normalizar filtros antes de enviarlos.
