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
- `colors.ts`: tokens visuales Blossom.
- `index.ts`: barrel controlado.

## External Deps
- React Native components, NativeWind, lucide-react-native.

## Risks / TODOs
- Evitar estilos inline repetidos fuera de componentes base.
- Mantener textos legibles en pantallas pequenas.
- Usar `colors.ts` para valores no expresables con clases NativeWind.
