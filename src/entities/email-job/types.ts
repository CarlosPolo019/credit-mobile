export type EmailJobStatus = "PENDING" | "PROCESSING" | "SENT" | "RETRY" | "FAILED";

export type EmailJob = {
  id: string;
  creditId: string;
  recipient: string;
  clientName: string;
  creditAmount: number | string;
  salespersonName: string;
  registeredAt?: string;
  status: EmailJobStatus;
  attempts: number;
  lastError: string;
  createdAt?: string;
  processedAt?: string | null;
  nextAttemptAt?: string | null;
};

export type EmailJobFilters = {
  status: string;
  search: string;
  sortBy: "createdAt" | "status";
  direction: "asc" | "desc";
};

export type EmailJobListResponse = {
  items?: EmailJob[];
  total?: number;
};
