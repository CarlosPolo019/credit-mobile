# Email Job Entity

## Purpose
- Tipos del trabajo de notificacion por correo (`EmailJob`, `EmailJobStatus`, `EmailJobFilters`), espejo de `EmailJobResponse`/`EmailJobListResponse` del backend.

## Key Files -> Role
- `types.ts`: solo tipos, sin logica.

## Risks / TODOs
- Mantener sincronizado con `credit-backend/src/main/java/com/fya/credits/dto/response/EmailJobResponse.java` si cambian campos.
