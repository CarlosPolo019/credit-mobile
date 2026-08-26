# Login Page

## Purpose
- Capturar identificador y clave para crear sesion.

## Key Files -> Role
- `LoginPage.tsx`: formulario publico y errores.

## External Deps
- `entities/session/SessionContext.tsx`
- `features/auth/api.ts`

## Risks / TODOs
- No persistir passwords.
- No navegar manualmente si `SessionProvider` ya cambia el stack.
- Ofrecer acceso a `Register` sin requerir sesion.
- No forzar teclado numerico en login: el backend acepta `username` y conserva usuario demo.
