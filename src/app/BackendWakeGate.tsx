import { type ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { config } from "@/shared/config/env";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { colors } from "@/shared/ui";

const HEALTH_CHECK_TIMEOUT_MS = 5000;
const POLL_INTERVAL_MS = 4000;
const MAX_WAIT_MS = 5 * 60 * 1000;
const MESSAGE_ROTATION_MS = 4000;

// Buckets by elapsed time (ms), each with a few messages that rotate in
// order so the wait — up to 5 minutes on a very slow cold start — reads as
// a story with beats instead of one static line staring back at you.
const MESSAGE_BUCKETS: { until: number; messages: string[] }[] = [
  { until: 8000, messages: ["Conectando con el servidor...", "Verificando la conexión..."] },
  {
    until: 25000,
    messages: [
      "El servidor estaba dormido, dándole un empujoncito...",
      "Encendiendo motores...",
      "Ya se despertó, dale un momento para estar listo...",
    ],
  },
  {
    until: 70000,
    messages: [
      "Vamos por buen camino...",
      "Cada segundo que pasa estamos más cerca...",
      "El servidor se está desperezando...",
      "Un poquito más de paciencia...",
    ],
  },
  {
    until: 150000,
    messages: [
      "Gracias por esperar, ya casi...",
      "Esto no es lo normal, pero ya falta poco...",
      "Seguimos aquí, no te vayas...",
      "Los últimos ajustes están en camino...",
    ],
  },
  {
    until: Infinity,
    messages: [
      "Sabemos que es más de lo normal, gracias por tu paciencia...",
      "Ya casi, de verdad...",
      "Esto está por terminar...",
      "Un último esfuerzo y estamos listos...",
    ],
  },
];

function messageForElapsed(elapsedMs: number, rotationIndex: number) {
  const bucket = MESSAGE_BUCKETS.find((candidate) => elapsedMs < candidate.until) ?? MESSAGE_BUCKETS[MESSAGE_BUCKETS.length - 1];
  return bucket.messages[rotationIndex % bucket.messages.length];
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
  const [rotationIndex, setRotationIndex] = useState(0);

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
    setRotationIndex(0);
    poll();
    const tickTimer = setInterval(() => {
      if (!cancelled) setElapsedMs(Date.now() - startedAt);
    }, 1000);
    const rotationTimer = setInterval(() => {
      if (!cancelled) setRotationIndex((index) => index + 1);
    }, MESSAGE_ROTATION_MS);

    return () => {
      cancelled = true;
      clearInterval(tickTimer);
      clearInterval(rotationTimer);
    };
  }, [isOnline]);

  if (isReady) return children;

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-white px-8 dark:bg-neutral-950">
      <ActivityIndicator color={colors.brand700} size="large" />
      <Text className="text-base font-semibold text-gray-900 dark:text-neutral-50">Despertando el servidor</Text>
      <Text className="text-center text-sm text-gray-500 dark:text-neutral-400">
        {messageForElapsed(elapsedMs, rotationIndex)}
      </Text>
    </View>
  );
}
