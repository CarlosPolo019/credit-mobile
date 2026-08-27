import type { CreditDirection, CreditPayload, CreditSortBy } from "./types";

export type CreditFormValues = {
  clientFirstName: string;
  clientSecondName: string;
  clientFirstSurname: string;
  clientSecondSurname: string;
  clientDocument: string;
  amount: string;
  interestRate: string;
  termMonths: string;
};

export type CreditValidationResult = {
  isValid: boolean;
  errors: Partial<Record<keyof CreditFormValues, string>>;
  value: CreditPayload;
};

// Mirrors credit-backend's CreditLimits (dto/request/CreditLimits.java) and
// credit-web's creditLimits (lib/creditValidation.js) — keep all three in
// sync. Bounded like a real consumer-credit product: monthly rate on a
// personal loan, term capped like a bank caps unsecured lending, max loan
// size a flat business rule.
export const creditLimits = {
  minAmount: 0,
  maxAmount: 200_000_000,
  minInterestRate: 0.5,
  maxInterestRate: 3.5,
  minTermMonths: 1,
  maxTermMonths: 60,
};

export function normalizeText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function validateCredit(values: CreditFormValues): CreditValidationResult {
  const errors: Partial<Record<keyof CreditFormValues, string>> = {};
  const clientFirstName = normalizeText(values.clientFirstName);
  const clientSecondName = normalizeText(values.clientSecondName);
  const clientFirstSurname = normalizeText(values.clientFirstSurname);
  const clientSecondSurname = normalizeText(values.clientSecondSurname);
  const clientDocument = normalizeText(values.clientDocument);
  const amount = Number(values.amount);
  const interestRate = Number(values.interestRate);
  const termMonths = Number(values.termMonths);

  if (!clientFirstName) errors.clientFirstName = "El primer nombre es obligatorio.";
  if (clientFirstName.length > 60) errors.clientFirstName = "Máximo 60 caracteres.";
  if (clientSecondName.length > 60) errors.clientSecondName = "Máximo 60 caracteres.";
  if (!clientFirstSurname) errors.clientFirstSurname = "El primer apellido es obligatorio.";
  if (clientFirstSurname.length > 60) errors.clientFirstSurname = "Máximo 60 caracteres.";
  if (clientSecondSurname.length > 60) errors.clientSecondSurname = "Máximo 60 caracteres.";
  if (!clientDocument) errors.clientDocument = "La cédula o ID es obligatoria.";
  if (!/^\d+$/.test(clientDocument)) errors.clientDocument = "La cédula o ID debe ser numérica.";
  if (clientDocument.length > 20) errors.clientDocument = "Máximo 20 caracteres.";
  if (!Number.isFinite(amount) || amount <= creditLimits.minAmount) {
    errors.amount = "El valor debe ser mayor que cero.";
  } else if (amount > creditLimits.maxAmount) {
    errors.amount = `El valor del crédito no puede superar ${creditLimits.maxAmount.toLocaleString("es-CO")}.`;
  }
  if (!Number.isFinite(interestRate) || interestRate < creditLimits.minInterestRate) {
    errors.interestRate = `La tasa de interés mensual debe ser de al menos ${creditLimits.minInterestRate}%.`;
  } else if (interestRate > creditLimits.maxInterestRate) {
    errors.interestRate = `La tasa de interés mensual no puede superar ${creditLimits.maxInterestRate}%.`;
  }
  if (!Number.isInteger(termMonths) || termMonths < creditLimits.minTermMonths) {
    errors.termMonths = `El plazo debe ser de al menos ${creditLimits.minTermMonths} mes.`;
  } else if (termMonths > creditLimits.maxTermMonths) {
    errors.termMonths = `El plazo no puede superar ${creditLimits.maxTermMonths} meses.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      clientFirstName,
      clientSecondName,
      clientFirstSurname,
      clientSecondSurname,
      clientDocument,
      amount,
      interestRate,
      termMonths,
    },
  };
}

export function normalizeSort(value: string): CreditSortBy {
  return value === "amount" ? "amount" : "createdAt";
}

export function normalizeDirection(value: string): CreditDirection {
  return value === "asc" ? "asc" : "desc";
}
