# Profile Page

## Purpose
- Tab "Perfil" (ultimo tab, visible para todos los roles): datos de la cuenta, estado de la cola offline de creditos, y cerrar sesion.

## Key Files -> Role
- `ProfilePage.tsx`: avatar + nombre + cedula (`PersonAvatar`), conteo de creditos pendientes/fallidos de sincronizar con boton "Sincronizar" manual (solo visible con internet — sin internet muestra un texto explicando que sincroniza solo al reconectar), y "Cerrar sesión". Refresca el conteo de la cola al ganar foco (`navigation.addListener("focus", ...)`), igual que antes hacia `HomePage`.

## External Deps
- `entities/session/SessionContext.tsx` (`session`, `logout`)
- `features/credits/offlineQueue.ts` (`countPendingAndFailed`), `features/credits/offlineSync.ts` (`syncQueuedCredits`)
- `shared/network/NetworkStatusContext.tsx`
- `shared/ui` (`PersonAvatar`, `Button`, `Screen`)

## Risks / TODOs
- Reemplazo al bottom sheet `ProfileSheetContent` que antes abria el avatar de `HomePage` (eliminado) — mismo contenido, ahora es una pantalla de tab en vez de un modal.
- El disparo automatico de sincronizacion al recuperar internet (antes vivia aca via `useEffect` sobre `isOnline`) se movio a `app/AppRouter.tsx` (`AutoSyncOnReconnect`) para que corra sin importar que tab tenga abierto el usuario — este componente solo mantiene el conteo visible y el boton de sincronizacion manual.
