# App

## Purpose
- Ensamblar providers globales y navegacion.

## Key Files -> Role
- `App.tsx`: `SafeAreaProvider`, `SessionProvider`, `NavigationContainer`.
- `AppRouter.tsx`: selecciona stack autenticado o publico y oculta headers nativos.

## External Deps
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-safe-area-context`

## Risks / TODOs
- No guardar estado de dominio aqui.
- Mantener rutas coherentes con `pages/**`.
- Registrar nuevas pantallas en `RootStackParamList`.
