# App

## Purpose
- Ensamblar providers globales y navegacion.

## Key Files -> Role
- `App.jsx`: `SafeAreaProvider`, `SessionProvider`, `NavigationContainer`.
- `AppRouter.jsx`: selecciona stack autenticado o publico.

## External Deps
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-safe-area-context`

## Risks / TODOs
- No guardar estado de dominio aqui.
- Mantener rutas coherentes con `pages/**`.

