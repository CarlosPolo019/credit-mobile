import { LogOut } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import type { TabScreenProps } from "@/app/navigation";
import { useSession } from "@/entities/session/SessionContext";
import { countPendingAndFailed } from "@/features/credits/offlineQueue";
import { syncQueuedCredits } from "@/features/credits/offlineSync";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { Button, PersonAvatar, Screen, colors } from "@/shared/ui";

type ProfilePageProps = TabScreenProps<"Profile">;

/**
 * Perfil tab — was previously a bottom sheet opened from HomePage's avatar;
 * promoted to its own screen now that it has a permanent tab. Owns the
 * offline-queue count/sync UI that used to live in HomePage (the
 * auto-sync-on-reconnect trigger itself now lives in AppRouter.tsx, at the
 * top of the authenticated tree, so it keeps firing even if the user never
 * opens this tab).
 */
export function ProfilePage({ navigation }: ProfilePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session, logout } = useSession();
  const { isOnline } = useNetworkStatus();
  const displayName = session?.user?.fullName || session?.user?.document || session?.user?.username || "Usuario";
  const [queueCounts, setQueueCounts] = useState({ pending: 0, failed: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshQueueCounts = useCallback(async () => {
    setQueueCounts(await countPendingAndFailed());
  }, []);

  useEffect(() => {
    return navigation.addListener("focus", refreshQueueCounts);
  }, [navigation, refreshQueueCounts]);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncQueuedCredits();
    } finally {
      await refreshQueueCounts();
      setIsSyncing(false);
    }
  }, [refreshQueueCounts]);

  const hasQueuedCredits = queueCounts.pending + queueCounts.failed > 0;

  return (
    <Screen scroll={false} contentClassName="pb-28">
      <View className="flex-1 items-center gap-3 py-6">
        <PersonAvatar name={displayName} size={64} />
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900 dark:text-neutral-50">{displayName}</Text>
          {session?.user?.document ? (
            <Text className="text-sm text-gray-500 dark:text-neutral-400">{session.user.document}</Text>
          ) : null}
        </View>

        <View className="w-full gap-2 border-t border-gray-100 pt-4 dark:border-neutral-900">
          <Text className="font-semibold text-gray-900 dark:text-neutral-50">Créditos pendientes de sincronizar</Text>
          <Text className="text-sm text-gray-500 dark:text-neutral-400">
            {hasQueuedCredits
              ? `${queueCounts.pending} pendiente(s)${queueCounts.failed > 0 ? `, ${queueCounts.failed} con error` : ""}`
              : "No hay créditos pendientes."}
          </Text>
          {isOnline ? (
            <Button title="Sincronizar" variant="secondary" loading={isSyncing} onPress={handleSync} disabled={!hasQueuedCredits} />
          ) : (
            <Text className="text-xs text-gray-400 dark:text-neutral-500">
              Se sincronizarán automáticamente al recuperar internet.
            </Text>
          )}
        </View>

        <View className="mt-auto w-full gap-3 pb-4 pt-6">
          <Button
            title="Cerrar sesión"
            variant="secondary"
            icon={<LogOut color={isDarkMode ? colors.neutral400 : colors.gray500} size={18} />}
            onPress={logout}
          />
        </View>
      </View>
    </Screen>
  );
}
