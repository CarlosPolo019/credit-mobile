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
- Registro mobile sigue el contrato backend `POST /api/v1/auth/register` con `{ fullName, document, password }`; `document` debe ser numerico.
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

## Mapa De Documentacion
Un solo `AGENTS.md` en todo el repo (este archivo). Cada capa y slice de `src/` tiene su propio `README.md` descriptivo (proposito, archivos clave, dependencias, riesgos) — leerlo antes de tocar esa area:

| Area | README |
|---|---|
| `src/` (vista general FSD) | `src/README.md` |
| `src/app` (navegacion, sesion global) | `src/app/README.md` |
| `src/pages` (capa de pantallas) | `src/pages/README.md` |
| `src/pages/login` | `src/pages/login/README.md` |
| `src/pages/register` | `src/pages/register/README.md` |
| `src/pages/home` | `src/pages/home/README.md` |
| `src/pages/credit-create` (formulario + confirmacion) | `src/pages/credit-create/README.md` |
| `src/pages/credit-list` (consulta + filtros) | `src/pages/credit-list/README.md` |
| `src/features` (capa de casos de uso) | `src/features/README.md` |
| `src/features/auth` | `src/features/auth/README.md` |
| `src/features/credits` | `src/features/credits/README.md` |
| `src/entities` (capa de dominio) | `src/entities/README.md` |
| `src/entities/session` | `src/entities/session/README.md` |
| `src/entities/credit` (validacion, formato, pago estimado) | `src/entities/credit/README.md` |
| `src/shared` (capa transversal) | `src/shared/README.md` |
| `src/shared/ui` (componentes base, paleta de marca) | `src/shared/ui/README.md` |
| `src/shared/api` | `src/shared/api/README.md` |
| `src/shared/config` | `src/shared/config/README.md` |
| `src/shared/lib` | `src/shared/lib/README.md` |

Flujos completos (con diagrama) en `knowledge/`: `knowledge/auth/current-auth-session-flow.md`, `knowledge/credits/current-credit-registration-flow.md`, `knowledge/credits/current-credit-query-flow.md`, `knowledge/android/current-android-build-and-signing-flow.md`.

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
