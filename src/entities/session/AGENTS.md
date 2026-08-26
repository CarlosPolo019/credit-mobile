# Session Entity

## Purpose
- Mantener estado autenticado y restauracion de sesion.

## Key Files -> Role
- `SessionContext.jsx`: login, logout, restore y configuracion del cliente API.

## External Deps
- `react-native-keychain`
- `features/auth/api.js`
- `shared/api/client.js`

## Risks / TODOs
- Limpiar sesion al recibir `401`.
- No exponer token en logs.

