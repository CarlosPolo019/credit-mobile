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
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = "El valor debe ser mayor que cero.";
  if (!Number.isFinite(interestRate) || interestRate < 0) errors.interestRate = "La tasa no puede ser negativa.";
  if (!Number.isInteger(termMonths) || termMonths <= 0) errors.termMonths = "El plazo debe ser mayor que cero.";

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
