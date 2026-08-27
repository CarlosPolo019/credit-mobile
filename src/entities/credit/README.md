# Credit Entity

## Purpose
- Centralizar validacion y formateo de creditos.

## Key Files -> Role
- `validation.ts`: normaliza input, sort y direction.
- `format.ts`: moneda y fecha.
- `types.ts`: contratos locales de credito, incluye `estimatedMonthlyPayment`/`estimatedTotalToPay` en `Credit` y el tipo `CreditEstimate`.

## External Deps
- APIs nativas de JavaScript.

## Risks / TODOs
- `amount` e `interestRate` deben llegar al backend como valores numericos validos.
- Mantener sort compatible con backend.
- La cuota mensual y el total estimados NO se calculan aqui: vienen de `features/credits/api.ts#estimateCredit` (`POST /credits/estimate`) antes de guardar, o de `Credit.estimatedMonthlyPayment`/`estimatedTotalToPay` despues — no reintroducir una formula de amortizacion local.
