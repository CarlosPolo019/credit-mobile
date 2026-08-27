# Pages

## Purpose
- Pantallas de navegacion que componen features, entities y shared UI.

## Key Files -> Role
Cuatro de estas pantallas son tabs dentro de `app/MainTabs.tsx` (marcadas abajo); el resto se empujan encima de los tabs desde un acceso en Home o desde una fila de una lista. No hay pantalla de registro publico (ver `app/README.md`, `login/README.md`).
- `login/`: ingreso por identificador y clave. Publico, fuera de los tabs.
- `home/` (tab, solo `ADMIN`): accesos rapidos a Clientes y Dashboard. Para `USER` este tab no existe — ver `home/README.md`.
- `credit-create/` (tab "Registrar", boton central elevado en `FloatingTabBar`): registro (`CreditForm.tsx`, mode-aware, tambien usado por `credit-detail/CreditEditPage`).
- `credit-list/` (tab "Créditos"): consulta; cada fila navega al detalle (`CreditDetail`, fuera de los tabs).
- `profile/` (tab "Perfil"): datos de la cuenta, cola offline (estado + sincronizar), cerrar sesion. Reemplazo al bottom sheet que abria el avatar en Home.
- `credit-detail/`: detalle, editar (via `CreditEditPage` + `CreditForm` en modo `edit`), eliminar, ver PDF (se abre en el navegador del sistema), historial de auditoria. Se llega desde una fila de `credit-list`.
- `client-list/`: directorio de clientes de solo lectura, solo `role: "ADMIN"`. Sin tab propio, acceso desde Home.
- `email-job-list/` (tab "Correos", 5to tab, solo `ADMIN`): estado de notificaciones por correo (tambien exigido por el backend). A diferencia de `client-list`/`dashboard`, si tiene tab propio.
- `dashboard/`: resumen agregado (creditos por comercial, montos, correos por estado), solo `role: "ADMIN"`, calculado en el cliente a partir de `listCredits`/`listEmailJobs`. Sin tab propio, acceso desde Home.

## External Deps
- React Navigation route props.

## Risks / TODOs
- Evitar logica API directa cuando exista `features/**/api.ts`.
- Mantener estados de error/red claros.
- Mantener headers nativos ocultos; la navegacion visible vive dentro de cada pantalla.
