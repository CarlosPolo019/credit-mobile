# Source Agents Map

## Purpose
- Mapear la estructura FSD simplificada del runtime mobile.
- Mantener JavaScript-only y evitar imports cruzados innecesarios.

## Key Files -> Role
- `app/`: providers y navegacion.
- `pages/`: pantallas route-level.
- `features/`: capacidades de auth y creditos.
- `entities/`: validacion/formato de dominio y sesion.
- `shared/`: API, config, storage y UI reusable.

## External Deps
- React Native, React Navigation, Axios, Keychain.

## Risks / TODOs
- No crear `.ts` o `.tsx`.
- No agregar AGENTS por debajo de layer/slice.
- No llamar backend desde UI si existe feature API.

