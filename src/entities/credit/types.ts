export type Credit = {
  id: string;
  clientFirstName?: string;
  clientSecondName?: string;
  clientFirstSurname?: string;
  clientSecondSurname?: string;
  clientName: string;
  clientDocument: string;
  amount: number | string;
  interestRate: number | string;
  termMonths: number;
  registeredByUserId?: string;
  salespersonDocument?: string;
  salespersonName: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  estimatedMonthlyPayment?: number | string;
  estimatedTotalToPay?: number | string;
};

export type CreditSortBy = "createdAt" | "amount";
export type CreditDirection = "asc" | "desc";

export type CreditFilters = {
  clientName: string;
  clientDocument: string;
  salesperson: string;
  sortBy: CreditSortBy;
  direction: CreditDirection;
};

export type CreditPayload = {
  clientFirstName: string;
  clientSecondName: string;
  clientFirstSurname: string;
  clientSecondSurname: string;
  clientDocument: string;
  amount: number;
  interestRate: number;
  termMonths: number;
};

export type CreditListResponse = {
  items?: Credit[];
  total?: number;
};

export type CreditFieldChange = {
  before: string;
  after: string;
};

export type CreditAuditEntry = {
  id: string;
  creditId: string;
  action: "UPDATED" | "DELETED";
  changedByUserId?: string;
  changedByDocument?: string;
  changedByName?: string;
  changedAt: string;
  changes: Record<string, CreditFieldChange>;
};

export type CreditEstimate = {
  monthlyPayment: number;
  totalToPay: number;
};
