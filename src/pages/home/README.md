# Home Page

## Purpose
- Tab "Inicio" (solo `ADMIN`, ver `app/MainTabs.tsx`) con accesos rapidos a las dos pantallas admin-only que no tienen tab propio: Clientes y Dashboard.

## Key Files -> Role
- `HomePage.tsx`: para `session.user.role === "ADMIN"` (hoy, solo Carlos Escorcia), lista `ActionRow`s a `ClientList` y `Dashboard`. Para cualquier otra cuenta este tab ni siquiera se monta (`MainTabs.tsx` omite el `Tab.Screen` "Home" condicionalmente), asi que el `else` de este componente (un texto invitando a usar las pestañas de abajo) en la practica nunca se ve — solo defiende contra el caso raro de que el rol cambie mientras el componente ya esta montado.

## External Deps
- `entities/session/SessionContext.tsx`

## Risks / TODOs
- Mantener accesos claros y sin llamadas API innecesarias — esta pantalla no hace fetch de nada, solo navega.
- No agregar de vuelta a Registrar/Consultar créditos ni a Correos como `ActionRow`: esos tres ya tienen su propio tab (`credit-create`, `credit-list`, `email-job-list`) — listarlos aca tambien seria una ruta duplicada y confusa.
- El acceso al perfil del usuario (antes un bottom sheet que abria el avatar de esta pantalla) ahora es el tab "Perfil" — ver `pages/profile/README.md`.
