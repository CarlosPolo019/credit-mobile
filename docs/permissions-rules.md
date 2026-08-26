# Android Permissions Rules

## Permisos Actuales
- `android.permission.INTERNET`

## Reglas
- No agregar permisos sin justificar el flujo funcional.
- Si se agrega un permiso, documentar:
  - motivo;
  - pantalla/feature que lo usa;
  - fallback si el usuario lo niega;
  - prueba manual esperada.

## Estado
La app actual solo consume backend REST, por eso no requiere ubicacion, camara, contactos, storage externo ni bluetooth.

