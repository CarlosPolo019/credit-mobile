# Shared API

## Purpose
- Configurar Axios, token Bearer y manejo global de `401`.

## Key Files -> Role
- `client.js`: instancia Axios, `configureApi`, interceptores.

## External Deps
- Axios.

## Risks / TODOs
- `baseURL` viene de `shared/config/env.js`.
- No hardcodear tokens ni secretos.

