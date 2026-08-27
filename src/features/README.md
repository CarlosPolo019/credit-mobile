# Features

## Purpose
- Encapsular capacidades de usuario y llamadas API por caso de uso.

## Key Files -> Role
- `auth/api.ts`: login y registro.
- `credits/api.ts`: crear/listar/obtener/editar/eliminar creditos, historial de auditoria.
- `credits/pdf.ts`: abre el PDF del backend (`GET /credits/{id}/pdf`) directo en el navegador via `Linking.openURL`, con el token como query param (un tab de navegador no puede mandar el header `Authorization`).

## External Deps
- `shared/api/client.ts`

## Risks / TODOs
- No mezclar UI dentro de features.
- Normalizar filtros antes de enviarlos.
