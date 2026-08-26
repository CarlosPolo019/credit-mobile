# Session Entity

## Purpose
- Mantener estado autenticado y restauracion de sesion.

## Key Files -> Role
- `SessionContext.tsx`: login, register, logout, restore y configuracion del cliente API.
- `types.ts`: contrato local de sesion.

## External Deps
- `react-native-keychain`
- `features/auth/api.ts`
- `shared/api/client.ts`

## Risks / TODOs
- Limpiar sesion al recibir `401`.
- No exponer token en logs.
- Login usa `username` del backend; registro usa `document` numerico como identidad del usuario registrado.
