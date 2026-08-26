# Pages

## Purpose
- Pantallas de navegacion que componen features, entities y shared UI.

## Key Files -> Role
- `login/`: ingreso por cedula y clave.
- `register/`: alta de usuario por cedula.
- `home/`: accesos principales.
- `credit-create/`: registro.
- `credit-list/`: consulta.

## External Deps
- React Navigation route props.

## Risks / TODOs
- Evitar logica API directa cuando exista `features/**/api.ts`.
- Mantener estados de error/red claros.
- Mantener headers nativos ocultos; la navegacion visible vive dentro de cada pantalla.
