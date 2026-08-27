# Credit Mobile

App Android (React Native) para la prueba técnica de créditos de Fya Social Capital — la contraparte para el comercial en campo de `credit-web`.

## Sobre esta prueba técnica

Este repo es **uno de los tres entregables independientes** de la prueba técnica de créditos:

| Repo | Rol | README |
|---|---|---|
| `credit-backend` | API REST, Firestore, JWT, worker de correo | [`../credit-backend/README.md`](../credit-backend/README.md) |
| `credit-web` | Panel administrativo (React) para registrar/consultar créditos y monitorear correos | [`../credit-web/README.md`](../credit-web/README.md) |
| `credit-mobile` (este repo) | App Android (React Native) para el comercial en campo | — |

## Architecture

```mermaid
flowchart LR
  web["credit-web · React admin"] -->|REST + JWT| api["credit-backend · Spring Boot"]
  mobile["credit-mobile · React Native"] -->|REST + JWT| api
  api --> firestore[("Cloud Firestore")]
```

### Registrar crédito (con confirmación, online)

```mermaid
sequenceDiagram
  participant User as Comercial
  participant Form as CreditForm
  participant Sheet as CreditConfirmSheetContent
  participant API as credit-backend
  User->>Form: Completa cédula, nombre, valor, tasa, plazo
  Form->>Form: valida (sin pedir Comercial: viene de la sesión)
  Form->>API: POST /api/v1/credits/estimate
  API-->>Form: cuota y total estimados
  Form->>Sheet: abre resumen + estimación (recibida del backend)
  User->>Sheet: Confirmar y registrar
  Sheet->>API: POST /api/v1/credits (Bearer JWT)
  API-->>Sheet: 201 CreditResponse
  Sheet-->>User: sheet se cierra, formulario se limpia
```

Sin internet, el registro sigue funcionando: se salta la estimación y el crédito se guarda en una cola local que se sincroniza sola al volver la conexión — ver [`knowledge/credits/current-credit-offline-queue-flow.md`](knowledge/credits/current-credit-offline-queue-flow.md).

## Stack

| Layer | Tech |
|---|---|
| Runtime | React Native 0.83.0, React 19.2.0, TypeScript |
| Navigation | React Navigation 7 |
| Styling | NativeWind — layout from `challenge-blossom`, brand tokens from Fya Social Capital (`brand-*`/`ink`, shared with `credit-web`) |
| HTTP | Axios |
| Icons | lucide-react-native |
| Session | react-native-keychain |
| PDF export | react-native-blob-util (authenticated download) + react-native-share (open/share) — the PDF itself is rendered server-side by `credit-backend` |
| Offline | @react-native-community/netinfo (connectivity detection) + @react-native-async-storage/async-storage (local credit queue) |

## Feature-Sliced Structure

| Layer | Purpose | Doc |
|---|---|---|
| `src/app` | Providers and navigation | [`src/app/README.md`](src/app/README.md) |
| `src/pages` | `login`, `register`, `home`, `credit-create`, `credit-list`, `credit-detail` | [`src/pages/README.md`](src/pages/README.md) |
| `src/features` | `auth` and `credits` APIs | [`src/features/README.md`](src/features/README.md) |
| `src/entities` | Session and credit rules/formatting/payment estimate | [`src/entities/README.md`](src/entities/README.md) |
| `src/shared` | API client, config, storage, UI kit | [`src/shared/README.md`](src/shared/README.md) |

## Requisitos Previos

| Herramienta | Versión | Notas |
|---|---|---|
| Node.js | 20+ | Ver `engines` en `package.json` |
| JDK | 17 | Para Gradle/Android |
| Android Studio o SDK CLI | — | Necesitás un emulador (AVD) o un dispositivo con depuración USB |
| `credit-backend` corriendo | — | El emulador apunta a `http://10.0.2.2:8080` por defecto |

## Instalación Paso A Paso

1. **Asegurate de tener `credit-backend` corriendo** (ver su README).
2. **Instalá dependencias:**
   ```bash
   cd credit-mobile
   npm install
   ```
3. **Levantá un emulador Android** (Android Studio → Device Manager, o `emulator -avd <nombre>`).
4. **Corré la app:**
   ```bash
   npm run android
   ```
   El emulador ya apunta a `http://10.0.2.2:8080` (equivalente a `localhost:8080` de tu máquina) sin configuración adicional.
5. **Iniciá sesión** con un usuario sembrado del backend (`900100001 / demo12345`) o el usuario demo (`demo / demo12345`).

Para un dispositivo físico o un build de release, seguí la sección [Build APK](#build-apk) con `CREDIT_API_BASE_URL` apuntando a un backend accesible por HTTPS.

## Configure Backend URL

For local Android emulator the default is:

```text
http://10.0.2.2:8080
```

For release builds, set `CREDIT_API_BASE_URL` before running the build command:

```bash
CREDIT_API_BASE_URL=https://fyatest-api.cmescorcia.com npm run build:apk
CREDIT_API_BASE_URL=https://fyatest-api.cmescorcia.com npm run build:aab
```

The npm lifecycle writes `src/shared/config/generated.env.ts` before Android build/start commands — it's generated and gitignored; change `CREDIT_API_BASE_URL`, not that file.

> **APK/AAB builds are only run when explicitly requested** (see `AGENTS.md`) — they're slow and unnecessary for most JS/TS changes.

## Features

- Login with `{ username, password }` + JWT (username is the cédula or the demo user).
- Register account with numeric document and password.
- Token storage in Keychain.
- Register credit with a confirmation step (estimated monthly installment/total) before submitting.
- Query active credits: filter by client, document, salesperson (select); sort by date or amount.
- Credit detail: view, edit, delete, audit history (who changed what), and export as a server-rendered PDF.
- Offline credit creation: works without internet by queueing locally and syncing automatically (or manually, from the profile sheet) once connectivity returns; editing/deleting/PDF/login/register still require internet.
- Animated branded splash screen and app icon.
- Session-expired handling.

## Capturas

| Login | Home |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Home](docs/screenshots/home.png) |

| Consultar créditos | Detalle de crédito |
|---|---|
| ![Consultar créditos](docs/screenshots/credit-list.png) | ![Detalle de crédito](docs/screenshots/credit-detail.png) |

| Editar crédito | Eliminar (confirmación) |
|---|---|
| ![Editar crédito](docs/screenshots/credit-edit.png) | ![Confirmar eliminación](docs/screenshots/credit-delete-confirm.png) |

## Build APK

```bash
npm run build:apk
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

## Build AAB

```bash
npm run build:aab
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## CI (GitHub Actions)

`.github/workflows/build-android.yml` builds the release APK and AAB. It's `workflow_dispatch`-only (manual trigger from the Actions tab) — there's no automatic build on push or tag, matching the "builds only when explicitly requested" policy above. It runs `npm run build:apk` and `npm run build:aab` with the signing secrets below and uploads both artifacts.

## Signing

Production signing uses:

| Variable | Purpose |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore (CI only) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Signing key alias |
| `ANDROID_KEY_PASSWORD` | Signing key password |

The CI workflow writes `release.keystore` only during CI runs. Local builds fall back to a debug-only keystore so an installable APK can be generated without production secrets. Gradle consumes `RELEASE_STORE_FILE`, `RELEASE_STORE_PASSWORD`, `RELEASE_KEY_ALIAS`, `RELEASE_KEY_PASSWORD`.

## Quality

```bash
npm run typecheck
npm run lint
npm test
```

## Documentation Map

| File | Covers |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Working rules for agents (the only `AGENTS.md` in this repo — includes the full doc map) |
| `src/**/README.md` | Per layer/slice: purpose, key files, risks |
| [`docs/permissions-rules.md`](docs/permissions-rules.md) | Android permissions |
| [`knowledge/auth/current-auth-session-flow.md`](knowledge/auth/current-auth-session-flow.md) | JWT session flow |
| [`knowledge/credits/current-credit-registration-flow.md`](knowledge/credits/current-credit-registration-flow.md) | Credit registration + confirmation |
| [`knowledge/credits/current-credit-query-flow.md`](knowledge/credits/current-credit-query-flow.md) | Credit query/filters |
| [`knowledge/credits/current-credit-detail-flow.md`](knowledge/credits/current-credit-detail-flow.md) | Credit detail: view, edit, delete, audit history, PDF export |
| [`knowledge/credits/current-credit-offline-queue-flow.md`](knowledge/credits/current-credit-offline-queue-flow.md) | Offline credit creation, local queue, sync |
| [`knowledge/android/current-android-build-and-signing-flow.md`](knowledge/android/current-android-build-and-signing-flow.md) | Build and signing |
