import { type ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { config } from "@/shared/config/env";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { colors } from "@/shared/ui";

const HEALTH_CHECK_TIMEOUT_MS = 5000;
const POLL_INTERVAL_MS = 3000;
const MAX_WAIT_MS = 75000;

function messageForElapsed(elapsedMs: number) {
  if (elapsedMs < 5000) return "Conectando con el servidor...";
  if (elapsedMs < 20000) return "El servidor estaba dormido, dándole un momento para despertar...";
  if (elapsedMs < 45000) return "Ya casi...";
  return "Un poco más de paciencia, esto puede tardar hasta un minuto la primera vez.";
}

type BackendWakeGateProps = {
  children: ReactNode;
};

/**
 * Render-blocking gate used only in front of the unauthenticated stack
 * (Login/Register — see AppRouter.tsx): the free Render tier can take 50s+
 * to cold-start after being idle, and there's no offline login, so poll
 * /actuator/health once up front and hold Login behind a "waking up"
 * message until it responds (or MAX_WAIT_MS passes, so a genuinely down
 * backend doesn't trap the user here forever — normal error handling in
 * shared/api/client.ts takes over from there).
 *
 * Deliberately NOT wrapped around the authenticated stack: once a session
 * exists, the offline queue lets the operator keep registering creditos
 * without waiting on the backend at all, so gating Home/CreditCreate on a
 * health check would block work that doesn't need it.
 */
export function BackendWakeGate({ children }: BackendWakeGateProps) {
  const { isOnline } = useNetworkStatus();
  const [isReady, setIsReady] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    // No device connectivity at all: polling would just fail every time
    // until MAX_WAIT_MS. Let the screen render immediately — OfflineBanner
    // and the normal "Sin conexión" error already cover this case.
    if (!isOnline) {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();
    const healthUrl = `${config.apiBaseUrl}/actuator/health`;

    async function checkHealth() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
        const response = await fetch(healthUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        return false;
      }
    }

    async function poll() {
      if (cancelled) return;
      const ok = await checkHealth();
      if (cancelled) return;
      const elapsed = Date.now() - startedAt;
      if (ok || elapsed >= MAX_WAIT_MS) {
        setIsReady(true);
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    setIsReady(false);
    poll();
    const tickTimer = setInterval(() => {
      if (!cancelled) setElapsedMs(Date.now() - startedAt);
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(tickTimer);
    };
  }, [isOnline]);

  if (isReady) return children;

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-white px-8 dark:bg-neutral-950">
      <ActivityIndicator color={colors.brand700} size="large" />
      <Text className="text-base font-semibold text-gray-900 dark:text-neutral-50">Despertando el servidor</Text>
      <Text className="text-center text-sm text-gray-500 dark:text-neutral-400">{messageForElapsed(elapsedMs)}</Text>
    </View>
  );
}
