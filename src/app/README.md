# App

## Purpose
- Ensamblar providers globales y navegacion.

## Key Files -> Role
- `App.tsx`: `SafeAreaProvider`, `NetworkStatusProvider`, `SessionProvider`, `NavigationContainer`; muestra `Splash` hasta que termina su animacion, luego `AppRouter`.
- `AppRouter.tsx`: renderiza `OfflineBanner` (arriba de todas las pantallas) y selecciona stack autenticado (`Home`, `CreditCreate`, `CreditList`, `CreditDetail`, `CreditEdit`) o publico (`Login`, `Register`); oculta headers nativos.
- `Splash.tsx`: splash animado con marca (RN `Animated`, sin Reanimated ni libreria nativa nueva) mientras arranca el bundle JS y se restaura la sesion; combinado con `android/app/src/main/res/drawable/splash_background.xml` para el arranque en frio nativo.

## External Deps
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-safe-area-context`
- `@react-native-community/netinfo` (via `shared/network`)

## Risks / TODOs
- No guardar estado de dominio aqui.
- Mantener rutas coherentes con `pages/**`.
- Registrar nuevas pantallas en `RootStackParamList`.
