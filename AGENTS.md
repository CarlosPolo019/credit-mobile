# AGENTS.md

Guia operativa para agentes que trabajen en `credit-mobile`.

## Mapa Rapido
- Stack: React Native 0.83.0, React 19.2.0, JavaScript, React Navigation 7.
- Plataforma objetivo: Android.
- Runtime source: `src/` con FSD simplificado.
- Capas: `app`, `pages`, `features`, `entities`, `shared`.
- API: REST contra Spring Boot; nunca Firestore directo.
- Sesion: JWT en `react-native-keychain`.
- Config: `CREDIT_API_BASE_URL` genera `src/shared/config/generated.env.js`.
- Android: solo permiso `INTERNET`; release APK/AAB por Gradle.

## Protocolo De Inicio
1. Ejecutar `pwd` y confirmar que estas en `credit-mobile`.
2. Revisar `git status --short --branch` si existe `.git`.
3. Leer este archivo y el `src/**/AGENTS.md` del area afectada.
4. Leer `README.md`, `docs/README.md` o `knowledge/README.md` cuando aplique.
5. Buscar usos con `rg` antes de cambiar contratos o imports.

## Protocolo De Cierre
1. Ejecutar `npm run check:js-only`, lint y tests.
2. Para cambios Android, ejecutar APK/AAB si el entorno lo permite.
3. Actualizar `src/**/AGENTS.md`, `docs/**` o `knowledge/**` si cambio comportamiento.
4. Revisar que `.env`, build outputs, `generated.env.js` y keystores no productivos no esten staged.
5. Crear commit Conventional Commit por checkpoint funcional.

## Protocolo De Subagentes
Cada subagente debe declarar:
- `Scope`
- `Files owned`
- `Files read-only`
- `Deliverable`
- `Validation command`

Reglas:
- No crear AGENTS mas profundo que `src/<layer>/<slice>/AGENTS.md`.
- No solapar ownership entre subagentes.
- El agente principal integra, valida y hace commits.
- Cerrar subagentes al terminar.

## Convenciones
- JavaScript-only estricto: no crear `.ts` ni `.tsx`.
- Componentes en `.jsx`; helpers, API y config en `.js`.
- UI copy puede estar en espanol; docs y codigo deben ser claros y consistentes.
- `generated.env.js` es generado, no se edita manualmente.
- `debug.keystore` es solo fallback local generado; produccion usa secrets.
- No versionar `.env`, keystores productivos, passwords, tokens ni API keys.

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
- `npm run check:js-only`
- `npm run lint`
- `npm test`
- `npm run build:apk`
- `npm run build:aab`

## Git Checkpoints
- Primer commit sugerido: `chore: bootstrap credit mobile`.
- Commit documental sugerido: `docs: add mobile agent governance and knowledge base`.

## Definition Of Done
- Login restaura y limpia sesion correctamente.
- Registro y consulta de creditos llaman al backend Spring Boot.
- Filtros y sorting usan campos allowlisted.
- APK y AAB se generan con `CREDIT_API_BASE_URL` correcto.
- No hay `.ts/.tsx` propios.
- README, `docs/**`, `knowledge/**` y `src/**/AGENTS.md` quedan sincronizados.
