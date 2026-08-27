# App

## Purpose
- Ensamblar providers globales y navegacion.

## Key Files -> Role
- `App.tsx`: `SafeAreaProvider`, `NetworkStatusProvider`, `SessionProvider`, `NavigationContainer`; muestra `Splash` hasta que termina su animacion, luego `AppRouter`.
- `AppRouter.tsx`: renderiza `OfflineBanner` (arriba de todas las pantallas) y selecciona stack autenticado (`Home`, `CreditCreate`, `CreditList`, `CreditDetail`, `CreditEdit`, `ClientList`, `EmailJobList`) o publico (solo `Login` — sin auto-registro, ver `pages/login/README.md`); el stack publico se envuelve en `BackendWakeGate`, el autenticado no (ver mas abajo); oculta headers nativos.
- `Splash.tsx`: splash animado con marca (RN `Animated`, sin Reanimated ni libreria nativa nueva) mientras arranca el bundle JS y se restaura la sesion; combinado con `android/app/src/main/res/drawable/splash_background.xml` para el arranque en frio nativo.
- `BackendWakeGate.tsx`: hace polling a `GET {apiBaseUrl}/actuator/health` (cada 4s, hasta 5 min) y bloquea el render con el logo animado (rebote + sombra + barra deslizante, `Animated` de RN, mismo criterio que `Splash.tsx`) y mensajes que rotan cada 4s en 5 tandas ("despertando el servidor" → "ya casi" → "gracias por esperar") mientras el backend (Render free tier) hace cold start; si se agota el tiempo, o si no hay internet (`useNetworkStatus`, no tiene sentido pollear sin conectividad), deja pasar igual. Solo envuelve el stack **no autenticado** (Login no tiene modo offline); el stack autenticado nunca espera al backend porque la cola offline (`features/credits/offlineQueue.ts`) permite seguir registrando creditos sin el.

## External Deps
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-safe-area-context`
- `@react-native-community/netinfo` (via `shared/network`)
- `shared/config/env.ts` (`config.apiBaseUrl`, usado por `BackendWakeGate`)

## Risks / TODOs
- No guardar estado de dominio aqui.
- Mantener rutas coherentes con `pages/**`.
- Registrar nuevas pantallas en `RootStackParamList`.
