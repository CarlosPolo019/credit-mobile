# Shared UI

## Purpose
- Componentes visuales reutilizables y consistentes.

## Key Files -> Role
- `Screen.tsx`: wrapper de pantalla con safe areas.
- `Button.tsx`: accion primaria/secundaria.
- `TextField.tsx`: input.
- `Banner.tsx`: mensajes de estado.
- `BottomSheetModal.tsx`: modal inferior para filtros.
- `SectionHeader.tsx`: encabezados compactos de listas/secciones.
- `SectionFooterMessage.tsx`: empty/error/footer text.
- `SectionFooterSpinner.tsx`: loading footer.
- `ErrorMessage.tsx`: errores inline.
- `colors.ts`: tokens visuales de marca Fya Social Capital (verde `brand600` `#00D280`, `brand700` `#049A5F`, `brand400` `#34D399`, `brand100` `#D0F7E6`, `ink` `#052224`) — mismos valores que `credit-web/ui/theme.js`, ya no la paleta violeta de la plantilla Blossom.
- `index.ts`: barrel controlado.

## External Deps
- React Native components, NativeWind, lucide-react-native.

## Risks / TODOs
- Evitar estilos inline repetidos fuera de componentes base.
- Mantener textos legibles en pantallas pequenas.
- Usar `colors.ts` para valores no expresables con clases NativeWind.
- Las clases NativeWind `brand-100/400/600/700` e `ink` se definen en `tailwind.config.js` (`theme.extend.colors`); no usar `violet-*`/`green-*` stock de Tailwind para elementos de marca.
