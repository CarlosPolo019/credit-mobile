# Network

## Purpose
- Estado de conectividad global (`online | limited | offline`) via `NetInfo`, consumido por el banner offline y por las paginas que necesitan saber si hay internet antes de llamar al backend.

## Key Files -> Role
- `NetworkStatusContext.tsx`: `NetworkStatusProvider` (se monta en `src/app/App.tsx`, alrededor de la navegacion) + hook `useNetworkStatus()` (`status`, `isOnline`).

## External Deps
- `@react-native-community/netinfo`

## Risks / TODOs
- `status: "limited"` (conectado pero `isInternetReachable` no resuelto) se trata como "no confiar todavia" en `OfflineBanner`, pero como online para las paginas (`isOnline` solo es `false` en `offline`) — evita bloquear creacion cuando NetInfo todavia esta resolviendo.
- No duplicar este estado localmente en paginas; siempre leer de `useNetworkStatus()`.
