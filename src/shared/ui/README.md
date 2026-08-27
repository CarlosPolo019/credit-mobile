# Shared UI

## Purpose
- Componentes visuales reutilizables y consistentes.

## Key Files -> Role
- `Screen.tsx`: wrapper de pantalla con safe areas; expone `useScrollToInput` (contexto) para que un `TextField` enfocado pida scroll hasta quedar visible arriba del teclado — un `ScrollView` en Android no hace esto solo, ni siquiera con `windowSoftInputMode="adjustResize"`.
- `Button.tsx`: accion primaria/secundaria.
- `TextField.tsx`: input; en `onFocus` consume `useScrollToInput` para pedirle al `Screen` padre que lo lleve a la vista. `helperText` (opcional) muestra un texto gris bajo el input cuando no hay `error` — usado por `CreditForm.tsx` para mostrar los límites de monto/tasa/plazo (mismo patrón que el helper text de `credit-web`).
- `Banner.tsx`: mensajes de estado.
- `BottomSheetModal.tsx`: modal inferior para filtros.
- `SectionHeader.tsx`: encabezados compactos de listas/secciones.
- `SectionFooterMessage.tsx`: empty/error/footer text.
- `SectionFooterSpinner.tsx`: loading footer.
- `ErrorMessage.tsx`: errores inline.
- `PersonAvatar.tsx`/`PersonChip`: avatar de persona — foto real para Adriana Castellano, Carlos Escorcia y Jennifer Navarro (`assets/images/people/*.jpg`, mismos archivos que `credit-web/public/people/`), iniciales sobre un color estable (hash del nombre) para cualquier otro. `PersonChip` agrega nombre + texto secundario al lado. Usado en `pages/profile/ProfilePage.tsx` (usuario logueado), `credit-detail`, `client-list` y `email-job-list`.
- `OfflineBanner.tsx`: banner fijo ("Sin conexión a internet" / "Conexión limitada") leido de `shared/network/NetworkStatusContext`; se renderiza una sola vez en `src/app/AppRouter.tsx`, arriba de `Stack.Navigator`.
- `colors.ts`: tokens visuales de marca Fya Social Capital (verde `brand600` `#00D280`, `brand700` `#049A5F`, `brand400` `#34D399`, `brand100` `#D0F7E6`, `ink` `#052224`) — mismos valores que `credit-web/ui/theme.js`, ya no la paleta violeta de la plantilla Blossom.
- `index.ts`: barrel controlado.

## External Deps
- React Native components, NativeWind, lucide-react-native.

## Risks / TODOs
- Evitar estilos inline repetidos fuera de componentes base.
- Mantener textos legibles en pantallas pequenas.
- Usar `colors.ts` para valores no expresables con clases NativeWind.
- Las clases NativeWind `brand-100/400/600/700` e `ink` se definen en `tailwind.config.js` (`theme.extend.colors`); no usar `violet-*`/`green-*` stock de Tailwind para elementos de marca.
