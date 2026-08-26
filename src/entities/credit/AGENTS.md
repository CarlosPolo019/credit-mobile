# Credit Entity

## Purpose
- Centralizar validacion y formateo de creditos.

## Key Files -> Role
- `validation.ts`: normaliza input, sort y direction.
- `format.ts`: moneda y fecha.
- `types.ts`: contratos locales de credito.

## External Deps
- APIs nativas de JavaScript.

## Risks / TODOs
- `amount` e `interestRate` deben llegar al backend como valores numericos validos.
- Mantener sort compatible con backend.
