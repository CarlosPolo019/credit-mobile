# Credit Mobile

React Native Android client for the Fya credit technical test.

## Stack
- React Native 0.83.0
- React 19.2.0
- JavaScript only
- React Navigation 7
- Axios
- react-native-keychain

## Estructura FSD
- `src/app`: providers y navegacion.
- `src/pages`: `login`, `home`, `credit-create`, `credit-list`.
- `src/features`: APIs de `auth` y `credits`.
- `src/entities`: sesion y reglas/formato de creditos.
- `src/shared`: API client, config, storage y UI.

## Install
```bash
npm install
```

## Configure Backend URL
For local Android emulator the default is:

```text
http://10.0.2.2:8080
```

For release builds, set `CREDIT_API_BASE_URL` before running the build command:

```bash
CREDIT_API_BASE_URL=https://your-render-backend.example.com npm run build:apk
CREDIT_API_BASE_URL=https://your-render-backend.example.com npm run build:aab
```

The npm lifecycle writes `src/shared/config/generated.env.js` before Android build/start commands. The default keeps emulator development working against a backend on localhost.
`generated.env.js` is generated and ignored by Git; change `CREDIT_API_BASE_URL`, not that file.
For release, use a real HTTPS backend URL.

## Run Android
```bash
npm run android
```

## Build APK
```bash
npm run build:apk
```

Output:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## Build AAB
```bash
npm run build:aab
```

Output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Signing
Production signing uses:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

The workflow writes `release.keystore` only during CI. Local builds generate a debug-only keystore so an installable APK can be generated without production secrets.

Gradle consumes:
- `RELEASE_STORE_FILE`
- `RELEASE_STORE_PASSWORD`
- `RELEASE_KEY_ALIAS`
- `RELEASE_KEY_PASSWORD`

## Features
- Login with JWT.
- Token storage in Keychain.
- Register credit.
- Query active credits.
- Filter by client, document, salesperson.
- Sort by date or amount.
- Session-expired handling.

## Documentacion Operativa
- `AGENTS.md`: gobierno general para agentes.
- `src/**/AGENTS.md`: reglas por capa/slice FSD.
- `docs/README.md`: planes y reglas tecnicas.
- `docs/permissions-rules.md`: permisos Android.
- `knowledge/README.md`: flujos actuales.
- `knowledge/auth/current-auth-session-flow.md`: sesion JWT.
- `knowledge/credits/current-credit-registration-flow.md`: registro.
- `knowledge/credits/current-credit-query-flow.md`: consulta.
- `knowledge/android/current-android-build-and-signing-flow.md`: build y firma.
