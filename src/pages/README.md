# Pages

## Purpose
- Pantallas de navegacion que componen features, entities y shared UI.

## Key Files -> Role
- `login/`: ingreso por identificador y clave.
- `register/`: alta de usuario por cedula.
- `home/`: accesos principales.
- `credit-create/`: registro (`CreditForm.tsx`, mode-aware, tambien usado por `credit-edit`).
- `credit-list/`: consulta; cada fila navega al detalle.
- `credit-detail/`: detalle, editar (via `CreditEditPage` + `CreditForm` en modo `edit`), eliminar, exportar PDF, historial de auditoria.

## External Deps
- React Navigation route props.

## Risks / TODOs
- Evitar logica API directa cuando exista `features/**/api.ts`.
- Mantener estados de error/red claros.
- Mantener headers nativos ocultos; la navegacion visible vive dentro de cada pantalla.
