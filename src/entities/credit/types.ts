export type Credit = {
  id: string;
  clientName: string;
  clientDocument: string;
  amount: number | string;
  interestRate: number | string;
  termMonths: number;
  salespersonName: string;
  createdAt?: string;
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
  clientName: string;
  clientDocument: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  salespersonName: string;
};

export type CreditListResponse = {
  items?: Credit[];
  total?: number;
};
