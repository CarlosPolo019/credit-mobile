# Shared

## Purpose
- Infraestructura y UI reutilizable sin logica de dominio pesada.

## Key Files -> Role
- `api/`: Axios e interceptores (incluye traduccion de errores de red sin `response` a un mensaje offline).
- `config/`: backend URL.
- `lib/`: storage.
- `network/`: estado de conectividad global (`NetworkStatusProvider`/`useNetworkStatus`, ver `network/README.md`).
- `ui/`: componentes visuales (incluye `OfflineBanner`).

## External Deps
- Axios, Keychain, `@react-native-community/netinfo`, React Native.

## Risks / TODOs
- No introducir dependencias de pages/features en shared.

