# Flow: Android Build And Signing

## Estado
- `active`

## Proposito
- Generar APK/AAB release configurables sin versionar secretos.

## Participantes
- `package.json`
- `scripts/write-mobile-config.js`
- `scripts/ensure-android-debug-keystore.js`
- `android/app/build.gradle`
- `.github/workflows/build-android.yml`

## Flujo
```mermaid
sequenceDiagram
  participant Dev
  participant NPM
  participant Script
  participant Gradle
  Dev->>NPM: npm run build:apk/aab
  NPM->>Script: write generated.env.js
  NPM->>Script: ensure debug keystore if needed
  NPM->>Gradle: assembleRelease or bundleRelease
  Gradle-->>Dev: app-release artifact
```

## Configuracion
- Local emulator default: `http://10.0.2.2:8080`.
- Release: usar `CREDIT_API_BASE_URL=https://...`.
- CI secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- Gradle env: `RELEASE_STORE_FILE`, `RELEASE_STORE_PASSWORD`, `RELEASE_KEY_ALIAS`, `RELEASE_KEY_PASSWORD`.

## Errores
- Si no hay secrets de release, Gradle cae a debug keystore generado localmente.
- `generated.env.js` y `debug.keystore` no se versionan.

## Validacion
- `npm run build:apk`
- `npm run build:aab`

