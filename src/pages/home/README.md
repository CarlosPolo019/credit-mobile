# Home Page

## Purpose
- Pantalla inicial autenticada con accesos a registrar y consultar creditos, y el acceso al perfil del usuario.

## Key Files -> Role
- `HomePage.tsx`: acciones de navegacion (`CreditCreate`, `CreditList`); el avatar en el header abre `ProfileSheetContent`. Sincroniza la cola offline automaticamente al recuperar internet (`useEffect` sobre `isOnline`) y al volver a foco (`navigation.addListener("focus", ...)`); un punto rojo en el avatar indica creditos pendientes/fallidos sin abrir el sheet. Si `session.user.role === "ADMIN"` (hoy, solo Carlos Escorcia), agrega tres accesos mas: `ClientList`, `EmailJobList` y `Dashboard` — ocultos para cualquier otra cuenta, mismo criterio que el sidebar de `credit-web`.
- `ProfileSheetContent.tsx`: bottom sheet con info del usuario (nombre, cedula, imagen), estado de la cola offline + boton "Sincronizar" (solo con internet), y "Cerrar sesión".

## External Deps
- `entities/session/SessionContext.tsx`
- `features/credits/offlineQueue.ts`, `features/credits/offlineSync.ts`
- `shared/network/NetworkStatusContext.tsx`
- `shared/ui` (`BottomSheetModal`)

## Risks / TODOs
- Mantener comandos claros y sin llamadas API innecesarias.
- El logout dentro del sheet lo cierra antes de invalidar la sesion (`profileSheetRef.current?.dismiss()` antes de `logout()`).
