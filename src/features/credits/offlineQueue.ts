import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CreditPayload } from "@/entities/credit/types";

const STORAGE_KEY = "fya-credit-offline-queue";

export type QueuedCreditStatus = "pending" | "syncing" | "failed";

export type QueuedCredit = {
  id: string;
  payload: CreditPayload;
  createdAt: string;
  attempts: number;
  status: QueuedCreditStatus;
  lastError: string;
};

async function readQueue(): Promise<QueuedCredit[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueuedCredit[];
  } catch {
    return [];
  }
}

async function writeQueue(queue: QueuedCredit[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function enqueueCredit(payload: CreditPayload): Promise<QueuedCredit> {
  const queue = await readQueue();
  const item: QueuedCredit = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: "pending",
    lastError: "",
  };
  await writeQueue([...queue, item]);
  return item;
}

export async function listQueuedCredits(): Promise<QueuedCredit[]> {
  return readQueue();
}

export async function countPendingAndFailed(): Promise<{ pending: number; failed: number }> {
  const queue = await readQueue();
  return {
    pending: queue.filter((item) => item.status === "pending" || item.status === "syncing").length,
    failed: queue.filter((item) => item.status === "failed").length,
  };
}

export async function removeQueuedCredit(id: string) {
  const queue = await readQueue();
  await writeQueue(queue.filter((item) => item.id !== id));
}

export async function markQueuedCreditSyncing(id: string) {
  const queue = await readQueue();
  await writeQueue(queue.map((item) => (item.id === id ? { ...item, status: "syncing" as const } : item)));
}

export async function markQueuedCreditFailed(id: string, error: string) {
  const queue = await readQueue();
  await writeQueue(
    queue.map((item) =>
      item.id === id ? { ...item, status: "failed" as const, attempts: item.attempts + 1, lastError: error } : item,
    ),
  );
}
