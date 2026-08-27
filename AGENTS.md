# AGENTS.md

Guia operativa para agentes que trabajen en `credit-mobile`.

## Mapa Rapido
- Stack: React Native 0.83.0, React 19.2.0, TypeScript, NativeWind, React Navigation 7.
- Plataforma objetivo: Android.
- Runtime source: `src/` con FSD simplificado.
- Capas: `app`, `pages`, `features`, `entities`, `shared`.
- API: REST contra Spring Boot; nunca Firestore directo.
- Sesion: JWT en `react-native-keychain`.
- UI: patron `challenge-blossom` (layout, `className`, `lucide-react-native`, bottom sheets y listas compactas) con la paleta de marca Fya Social Capital (`brand-*`/`ink`, ver `src/shared/ui/README.md`), no la paleta violeta original de Blossom.
- Config: `CREDIT_API_BASE_URL` genera `src/shared/config/generated.env.ts`.
- Android: solo permiso `INTERNET`; release APK/AAB por Gradle.
- Creditos: crear, listar, ver detalle, editar, eliminar, exportar a PDF (generado en `credit-backend`, no en el dispositivo) e historial de auditoria — ver `knowledge/credits/current-credit-detail-flow.md`.
- Cliente por cedula: al crear (no al editar), la cedula tiene autocomplete contra `GET /api/v1/clients` (mismo dato que `credit-web`); si matchea, el nombre se autocompleta y los campos quedan solo lectura, evitando nombres inconsistentes para la misma cedula.
- Navegacion: `src/app/navigation.ts` define `TabParamList`/`RootStackParamList`/`TabScreenProps` (fuente unica de tipos, para que `AppRouter.tsx` y `MainTabs.tsx` no se importen tipos entre si aunque si importan sus componentes). El stack autenticado (`AppRouter.tsx`) tiene una sola pantalla de primer nivel, `MainTabs` (`src/app/MainTabs.tsx`, un `Tab.Navigator` con tabBar 100% custom, `src/app/FloatingTabBar.tsx` — un pill flotante, no la barra nativa) mas `CreditDetail`/`CreditEdit`/`ClientList`/`Dashboard`, que se empujan encima de los tabs (pierden la barra flotante mientras estan abiertos, es el comportamiento esperado de un stack push). Dentro de `MainTabs`: `ADMIN` ve 5 tabs (Home, Créditos, Registrar — boton central elevado, ver "Registrar…" en `FloatingTabBar.tsx` — Correos, Perfil); un `USER` ve solo 3 (Créditos, Registrar, Perfil) — sin Home (solo tenia accesos de admin) ni Correos. `initialRouteName` del `Tab.Navigator` cambia segun el rol (`"Home"` vs `"CreditList"`).
- Clientes y Dashboard: pantallas admin-only sin tab propio (`pages/client-list`, `pages/dashboard`), accesibles solo desde los accesos rapidos de `HomePage` (que a su vez solo existe/se ve para `ADMIN`, ver punto anterior); si se navega igual sin el rol, redirigen (`goBack()`). `/api/v1/clients` no exige rol en el backend (lo usa el autocomplete, abierto a todos), solo la pantalla es de admin.
- Correos: a diferencia de Clientes/Dashboard, es un tab propio (5to, solo `ADMIN`, ver punto de Navegacion) en vez de un acceso rapido desde Home — `pages/email-job-list`. El guard de rol redirige a `navigation.navigate("Home")` en vez de `goBack()` porque, al ser un tab, no tiene una pantalla "anterior" de la que volver. `/api/v1/email-jobs` ademas lo exige el backend (403 para `USER`). Pagina en el cliente, 6 por pagina.
- Dashboard: sin endpoint propio, agrega en el cliente los mismos datos de `listCredits`/`listEmailJobs` (creditos por comercial, monto total, ganancia estimada, tasa promedio, correos por estado) — equivalente movil del "Dashboard" de `credit-web`.
- Splash: `src/app/Splash.tsx` (branded, `Animated` de RN, sin libreria nativa nueva) + `android/.../drawable/splash_background.xml` para el arranque en frio.
- Offline: `NetworkStatusProvider`/`OfflineBanner` (via `@react-native-community/netinfo`) detectan conectividad global; solo la creacion de creditos funciona sin internet, encolando en `AsyncStorage` (`features/credits/offlineQueue.ts`) y sincronizando al volver la conexion (`features/credits/offlineSync.ts`) — ver `knowledge/credits/current-credit-offline-queue-flow.md`.
- Cold start del backend: `src/app/BackendWakeGate.tsx` hace polling a `/actuator/health` (Render free tier duerme tras inactividad) y muestra mensajes de espera antes de dejar entrar a `AppRouter`. No hay job externo/CI manteniendo el backend despierto (se probo y no era confiable, ver `credit-backend/docs/deployment.md`).

## Protocolo De Inicio
1. Ejecutar `pwd` y confirmar que estas en `credit-mobile`.
2. Revisar `git status --short --branch` si existe `.git`.
3. Leer este archivo y el `src/**/README.md` del area afectada (ver "Mapa De Documentacion" abajo).
4. Leer `README.md`, `docs/README.md` o `knowledge/README.md` cuando aplique.
5. Buscar usos con `rg` antes de cambiar contratos o imports.

## Protocolo De Cierre
1. Ejecutar `npm run typecheck`, lint y tests.
2. No ejecutar `npm run build:apk` ni `npm run build:aab` salvo orden explicita del usuario en ese turno.
3. Actualizar `src/**/README.md`, `docs/**` o `knowledge/**` si cambio comportamiento.
4. Revisar que `.env`, build outputs, `generated.env.ts` y keystores no productivos no esten staged.
5. Crear commit Conventional Commit por checkpoint funcional.

## Protocolo De Subagentes
Cada subagente debe declarar:
- `Scope`
- `Files owned`
- `Files read-only`
- `Deliverable`
- `Validation command`

Reglas:
- Existe un unico `AGENTS.md` en todo el repo (la raiz). No crear otro `AGENTS.md` en ningun subdirectorio; la documentacion de capa/slice va en `README.md`, no mas profundo que `src/<layer>/<slice>/README.md`.
- No solapar ownership entre subagentes.
- El agente principal integra, valida y hace commits.
- Cerrar subagentes al terminar.

## Convenciones
- TypeScript permitido y preferido en `src/**`; mantener `credit-web` JavaScript-only.
- Componentes en `.tsx`; helpers, API y config en `.ts`.
- NativeWind es la capa visual principal; usar `colors.ts` para tokens compartidos e iconos de `lucide-react-native`.
- Login mobile sigue el contrato backend `POST /api/v1/auth/login` con `{ username, password }`; `username` puede ser cedula registrada o usuario demo.
- Sin auto-registro en mobile: las cuentas se crean solo desde `credit-web` (`/users`, admin-only). `POST /api/v1/auth/register` sigue existiendo en el backend (publico) pero ningun cliente lo usa.
- UI copy puede estar en espanol; docs y codigo deben ser claros y consistentes.
- `generated.env.ts` es generado, no se edita manualmente.
- `debug.keystore` es solo fallback local generado; produccion usa secrets.
- No versionar `.env`, keystores productivos, passwords, tokens ni API keys.

## Politica De Builds Android
- APK/AAB solo se compilan cuando el usuario lo ordena explicitamente.
- No compilar APK/AAB para cambios de UI JavaScript/TypeScript, contrato REST, docs, estilos NativeWind o validaciones locales.
- Para cambios de `src/**`, config Metro/Babel/Tailwind o tipos, preferir `npm run typecheck`, `npm run lint` y `npm test`.
- Pedir build Android solo si cambian Gradle, AndroidManifest, package nativo, signing, permisos, assets nativos, autolinking o versionado release.
- Si el usuario pide "validar rapido", no interpretar eso como permiso para APK/AAB.
- La orden de compilar debe ser explicita en el turno actual; no asumir autorizacion de turnos anteriores ni de pedidos genericos como "termina el cambio", "deja todo listo" o "valida todo".

## Correr En Un Dispositivo Fisico (`npm run android`, debug)
Tres errores ya vividos en este repo al instalar un build debug en un telefono real conectado por USB (no el emulador) — evitarlos de entrada:

1. **`CREDIT_API_BASE_URL=http://10.0.2.2:8080` (el default) no funciona en un dispositivo fisico.** `10.0.2.2` es un alias especial que solo el **emulador** de Android resuelve hacia el host; en un telefono real no resuelve a nada, asi que cada llamada a la API falla (login, listar creditos, etc. — se ve como error de conexion generalizado, no como un crash puntual). Para un dispositivo real, correr con una URL que el telefono si pueda alcanzar, por ejemplo la API de produccion:
   ```bash
   CREDIT_API_BASE_URL=https://fyatest-api.cmescorcia.com npm run android
   ```
   O usar directamente `npm run android:device` (mismo efecto, URL de produccion ya hardcodeada en `package.json` para no tener que escribirla/recordarla cada vez). Equivalente para levantar Metro solo: `npm run start:device`.
2. **`npm run android` corrido desde un shell no interactivo (por ejemplo, el Bash de un agente) no deja el bundler Metro corriendo.** `react-native run-android` normalmente abre una terminal nueva para Metro; sin terminal interactiva ese paso no pasa, el APK se instala bien pero al abrir la app da **"Unable to load script"** (no hay nada escuchando en `:8081`).
3. **Arrancar Metro con `npx react-native start` directo (en vez de `npm start`) salta el hook `prestart` (`node scripts/write-mobile-config.js`), asi que `generated.env.ts` se queda con la URL vieja/default aunque le pases `CREDIT_API_BASE_URL` a ese comando.** Esto paso en la practica: la app quedaba pegada en la pantalla de "despertando el servidor" para siempre porque seguia pegandole a `10.0.2.2:8080` desde el dispositivo real (punto 1), aunque el build original se habia hecho con la URL correcta — el Metro levantado a mano no la tenia. Antes de levantar Metro asi, regenerar el archivo a mano con la misma variable:
   ```bash
   CREDIT_API_BASE_URL=https://fyatest-api.cmescorcia.com node scripts/write-mobile-config.js
   CREDIT_API_BASE_URL=https://fyatest-api.cmescorcia.com npx react-native start &
   # confirmar: lsof -i :8081 (debe haber un proceso node), adb reverse --list (debe listar tcp:8081 tcp:8081),
   # y cat src/shared/config/generated.env.ts (debe mostrar la URL correcta, no 10.0.2.2)
   adb shell am force-stop com.creditmobile && adb shell am start -n com.creditmobile/.MainActivity
   ```
   Cambiar `generated.env.ts` a mano no alcanza solo: Metro con Fast Refresh no vuelve a leer ese archivo si el componente ya esta montado con el valor viejo en closure — hace falta el force-stop + relanzar para que arranque de cero con el bundle nuevo.
- Diagnostico rapido si algo falla despues de instalar: `adb logcat -d -v time | grep -iE "ReactNativeJS|FATAL EXCEPTION|unable to load script"` — pero en builds recientes los `console.log`/errores de JS ya no siempre aparecen ahi (el propio Metro avisa "JavaScript logs have moved" hacia React Native DevTools). Si logcat no muestra nada util, agregar un `console.log` temporal en el punto sospechoso (aparece con el tag `ReactNativeJS`) en vez de asumir que "sin log = sin error".

## Mapa De Documentacion
Un solo `AGENTS.md` en todo el repo (este archivo). Cada capa y slice de `src/` tiene su propio `README.md` descriptivo (proposito, archivos clave, dependencias, riesgos) — leerlo antes de tocar esa area:

| Area | README |
|---|---|
| `src/` (vista general FSD) | `src/README.md` |
| `src/app` (navegacion, sesion global) | `src/app/README.md` |
| `src/pages` (capa de pantallas) | `src/pages/README.md` |
| `src/pages/login` | `src/pages/login/README.md` |
| `src/pages/home` (landing tab, admin-only quick links) | `src/pages/home/README.md` |
| `src/pages/profile` (tab, antes bottom sheet) | `src/pages/profile/README.md` |
| `src/pages/credit-create` (formulario + confirmacion, tab "Registrar") | `src/pages/credit-create/README.md` |
| `src/pages/credit-list` (consulta + filtros, tab "Créditos") | `src/pages/credit-list/README.md` |
| `src/pages/credit-detail` (detalle, editar, eliminar, auditoria, PDF) | `src/pages/credit-detail/README.md` |
| `src/pages/client-list` (directorio de clientes, solo `ADMIN`) | `src/pages/client-list/README.md` |
| `src/pages/email-job-list` (estado de correos, solo `ADMIN`) | `src/pages/email-job-list/README.md` |
| `src/pages/dashboard` (resumen agregado, solo `ADMIN`) | `src/pages/dashboard/README.md` |
| `src/features` (capa de casos de uso) | `src/features/README.md` |
| `src/features/auth` | `src/features/auth/README.md` |
| `src/features/credits` | `src/features/credits/README.md` |
| `src/features/email-jobs` (solo lectura, admin) | `src/features/email-jobs/README.md` |
| `src/entities` (capa de dominio) | `src/entities/README.md` |
| `src/entities/session` | `src/entities/session/README.md` |
| `src/entities/credit` (validacion, formato, pago estimado) | `src/entities/credit/README.md` |
| `src/entities/email-job` (tipos, solo lectura) | `src/entities/email-job/README.md` |
| `src/shared` (capa transversal) | `src/shared/README.md` |
| `src/shared/ui` (componentes base, paleta de marca) | `src/shared/ui/README.md` |
| `src/shared/api` | `src/shared/api/README.md` |
| `src/shared/config` | `src/shared/config/README.md` |
| `src/shared/lib` | `src/shared/lib/README.md` |
| `src/shared/network` (estado de conectividad global) | `src/shared/network/README.md` |

Flujos completos (con diagrama) en `knowledge/`: `knowledge/auth/current-auth-session-flow.md`, `knowledge/credits/current-credit-registration-flow.md`, `knowledge/credits/current-credit-query-flow.md`, `knowledge/credits/current-credit-detail-flow.md`, `knowledge/credits/current-credit-offline-queue-flow.md`, `knowledge/android/current-android-build-and-signing-flow.md`.

## Documentacion Obligatoria
- Cambios de estructura FSD: actualizar `src/AGENTS.md` y el AGENTS de capa/slice.
- Cambios de auth: actualizar `knowledge/auth/current-auth-session-flow.md`.
- Cambios de creditos: actualizar docs en `knowledge/credits/`.
- Cambios Android/build/signing: actualizar `knowledge/android/current-android-build-and-signing-flow.md`.
- Cambios de permisos: actualizar `docs/permissions-rules.md`.
- Cambios de planificacion: actualizar `docs/planning-guidelines.md`.

## Comandos
- `npm install`
- `npm run android`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build:apk` solo con orden explicita del usuario.
- `npm run build:aab` solo con orden explicita del usuario.

## Git Checkpoints
- Primer commit sugerido: `chore: bootstrap credit mobile`.
- Commit documental sugerido: `docs: add mobile agent governance and knowledge base`.

## Definition Of Done
- Registro por cedula y login por `username` backend restauran y limpian sesion correctamente.
- Registro y consulta de creditos llaman al backend Spring Boot.
- Filtros y sorting usan campos allowlisted.
- APK y AAB se generan con `CREDIT_API_BASE_URL` correcto solo cuando el usuario ordena build Android.
- TypeScript, NativeWind y alias `@/` compilan con `npm run typecheck`.
- README, `docs/**`, `knowledge/**` y `src/**/README.md` quedan sincronizados.
