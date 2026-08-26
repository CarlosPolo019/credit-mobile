# Flow: <Name>

## Estado
- `active | deprecated | archived`

## Proposito
- <Que resuelve el flujo>

## Participantes
- <Pantalla, feature, entity, shared module>

## Flujo
```mermaid
sequenceDiagram
  participant User
  participant App
  participant API
  User->>App: Action
  App->>API: Request
  API-->>App: Response
```

## Errores
- <Errores esperados y manejo>

## Validacion
- <Comandos o pruebas manuales>

