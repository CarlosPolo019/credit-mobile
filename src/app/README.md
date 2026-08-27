# App

## Purpose
- Ensamblar providers globales y navegacion.

## Key Files -> Role
- `App.tsx`: `SafeAreaProvider`, `NetworkStatusProvider`, `SessionProvider`, `NavigationContainer`; muestra `Splash` hasta que termina su animacion, luego `AppRouter`.
- `navigation.ts`: fuente unica de tipos de navegacion — `TabParamList` (Home, CreditList, CreditCreate, EmailJobList, Profile), `RootStackParamList` (Login, MainTabs, CreditDetail, CreditEdit, ClientList, Dashboard) y `TabScreenProps<T>`/`RootStackScreenProps<T>`. Vive separado de `AppRouter.tsx`/`MainTabs.tsx` para que ninguno de los dos tenga que importar tipos del otro, aunque si importan sus componentes.
- `AppRouter.tsx`: renderiza `OfflineBanner` y, si hay sesion, `AutoSyncOnReconnect` (componente headless — dispara `syncQueuedCredits()` cuando `isOnline` pasa a `true`; vive aca, no en un tab, para que corra sin importar que tab tenga abierto el usuario). El stack autenticado tiene una sola pantalla de primer nivel, `MainTabs`, mas `CreditDetail`/`CreditEdit`/`ClientList`/`Dashboard`, que se empujan encima (pierden la barra de tabs mientras estan abiertas). El stack publico es solo `Login` (sin auto-registro, ver `pages/login/README.md`) y se envuelve en `BackendWakeGate`, el autenticado no (ver mas abajo); oculta headers nativos.
- `MainTabs.tsx`: `Tab.Navigator` (`@react-navigation/bottom-tabs`) con `tabBar` 100% custom (`FloatingTabBar.tsx`, no la barra nativa). `ADMIN` ve 5 tabs (Home, Créditos, Registrar, Correos, Perfil); un `USER` ve 3 (Créditos, Registrar, Perfil) — sin Home (solo tenia accesos de admin) ni Correos, ambos omitidos condicionalmente de la lista de `Tab.Screen`. `initialRouteName` cambia segun el rol (`"Home"` para admin, `"CreditList"` para el resto).
- `FloatingTabBar.tsx`: pill flotante (no la barra nativa de bottom-tabs) con sombra, `position: absolute` sobre el contenido — por eso cada pantalla dentro de `MainTabs` necesita su propio padding inferior (`pb-28`-ish) para que la barra no tape el contenido, React Navigation no reserva ese espacio automaticamente cuando el `tabBar` es custom. El tab "Registrar" (`CreditCreate`) se renderiza como un boton circular elevado y de color solido en vez de un icono plano — es el que "destaca", queda visualmente al centro de la barra (3ro de 4 tabs, o exacto centro de 5 cuando Correos esta presente).
- `Splash.tsx`: splash animado con marca (RN `Animated`, sin Reanimated ni libreria nativa nueva) mientras arranca el bundle JS y se restaura la sesion; combinado con `android/app/src/main/res/drawable/splash_background.xml` para el arranque en frio nativo.
- `BackendWakeGate.tsx`: hace polling a `GET {apiBaseUrl}/actuator/health` (cada 4s, hasta 5 min) y bloquea el render con el logo animado (rebote + sombra + barra deslizante, `Animated` de RN, mismo criterio que `Splash.tsx`) y mensajes que rotan cada 4s en 5 tandas ("despertando el servidor" → "ya casi" → "gracias por esperar") mientras el backend (Render free tier) hace cold start; si se agota el tiempo, o si no hay internet (`useNetworkStatus`, no tiene sentido pollear sin conectividad), deja pasar igual. Solo envuelve el stack **no autenticado** (Login no tiene modo offline); el stack autenticado nunca espera al backend porque la cola offline (`features/credits/offlineQueue.ts`) permite seguir registrando creditos sin el.

## External Deps
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs` (`MainTabs.tsx`)
- `react-native-safe-area-context` (insets del `FloatingTabBar`)
- `@react-native-community/netinfo` (via `shared/network`)
- `shared/config/env.ts` (`config.apiBaseUrl`, usado por `BackendWakeGate`)

## Risks / TODOs
- No guardar estado de dominio aqui.
- Mantener rutas coherentes con `pages/**`.
- Registrar nuevas pantallas en `RootStackParamList`.
