# Source Agents Map

## Purpose
- Mapear la estructura FSD simplificada del runtime mobile.
- Mantener TypeScript en mobile y evitar imports cruzados innecesarios.

## Key Files -> Role
- `app/`: providers y navegacion.
- `pages/`: pantallas route-level.
- `features/`: capacidades de auth y creditos.
- `entities/`: validacion/formato de dominio y sesion.
- `shared/`: API, config, storage y UI reusable.

## External Deps
- React Native, React Navigation, NativeWind, Axios, Keychain.

## Risks / TODOs
- Componentes de pantalla/UI en `.tsx`; helpers, API, config y tipos en `.ts`.
- Reutilizar tokens de `shared/ui/colors.ts` y estilos NativeWind antes de agregar estilos locales.
- No agregar AGENTS por debajo de layer/slice.
- No llamar backend desde UI si existe feature API.
