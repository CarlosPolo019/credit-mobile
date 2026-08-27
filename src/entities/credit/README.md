# Credit Entity

## Purpose
- Centralizar validacion y formateo de creditos.

## Key Files -> Role
- `validation.ts`: normaliza input, sort y direction; exporta `creditLimits` (monto máx. 200.000.000, tasa mensual 0.5%–3.5%, plazo 1–60 meses — mismos límites que `credit-web`'s `creditLimits` y `credit-backend`'s `CreditLimits`, mantener los tres sincronizados) y valida contra ellos en `validateCredit`.
- `format.ts`: moneda y fecha.
- `types.ts`: contratos locales de credito, incluye `estimatedMonthlyPayment`/`estimatedTotalToPay` en `Credit` y el tipo `CreditEstimate`.

## External Deps
- APIs nativas de JavaScript.

## Risks / TODOs
- `amount` e `interestRate` deben llegar al backend como valores numericos validos.
- Mantener sort compatible con backend.
- La cuota mensual y el total estimados NO se calculan aqui: vienen de `features/credits/api.ts#estimateCredit` (`POST /credits/estimate`) antes de guardar, o de `Credit.estimatedMonthlyPayment`/`estimatedTotalToPay` despues — no reintroducir una formula de amortizacion local.
