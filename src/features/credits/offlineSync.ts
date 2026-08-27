import { createCredit } from "./api";
import { listQueuedCredits, markQueuedCreditFailed, markQueuedCreditSyncing, removeQueuedCredit } from "./offlineQueue";

/**
 * Drains the local credit queue against POST /api/v1/credits. Each item is
 * synced independently so one failure doesn't block the rest of the queue.
 */
export async function syncQueuedCredits() {
  const queue = await listQueuedCredits();
  const toSync = queue.filter((item) => item.status !== "syncing");

  for (const item of toSync) {
    await markQueuedCreditSyncing(item.id);
    try {
      await createCredit(item.payload);
      await removeQueuedCredit(item.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo sincronizar.";
      await markQueuedCreditFailed(item.id, message);
    }
  }
}
