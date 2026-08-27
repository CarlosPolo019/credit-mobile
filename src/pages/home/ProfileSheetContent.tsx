import { LogOut } from "lucide-react-native";
import { Image, Text, View, useColorScheme } from "react-native";
import type { SessionUser } from "@/entities/session/types";
import { Button, colors } from "@/shared/ui";

type ProfileSheetContentProps = {
  user: SessionUser | undefined;
  isOnline: boolean;
  queueCounts: { pending: number; failed: number };
  isSyncing: boolean;
  onSync: () => void;
  onLogout: () => void;
};

export function ProfileSheetContent({ user, isOnline, queueCounts, isSyncing, onSync, onLogout }: ProfileSheetContentProps) {
  const isDarkMode = useColorScheme() === "dark";
  const displayName = user?.fullName || user?.document || user?.username || "Usuario";
  const hasQueuedCredits = queueCounts.pending + queueCounts.failed > 0;

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="items-center gap-3 py-6">
        <Image
          source={require("../../../assets/images/fya-mark.png")}
          className="h-16 w-16 rounded-full bg-brand-100 dark:bg-neutral-800"
          resizeMode="contain"
        />
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900 dark:text-neutral-50">{displayName}</Text>
          {user?.document ? <Text className="text-sm text-gray-500 dark:text-neutral-400">{user.document}</Text> : null}
        </View>
      </View>

      <View className="gap-2 border-t border-gray-100 pt-4 dark:border-neutral-900">
        <Text className="font-semibold text-gray-900 dark:text-neutral-50">Créditos pendientes de sincronizar</Text>
        <Text className="text-sm text-gray-500 dark:text-neutral-400">
          {hasQueuedCredits
            ? `${queueCounts.pending} pendiente(s)${queueCounts.failed > 0 ? `, ${queueCounts.failed} con error` : ""}`
            : "No hay créditos pendientes."}
        </Text>
        {isOnline ? (
          <Button title="Sincronizar" variant="secondary" loading={isSyncing} onPress={onSync} disabled={!hasQueuedCredits} />
        ) : (
          <Text className="text-xs text-gray-400 dark:text-neutral-500">
            Se sincronizarán automáticamente al recuperar internet.
          </Text>
        )}
      </View>

      <View className="mt-auto gap-3 pb-4 pt-6">
        <Button
          title="Cerrar sesión"
          variant="secondary"
          icon={<LogOut color={isDarkMode ? colors.neutral400 : colors.gray500} size={18} />}
          onPress={onLogout}
        />
      </View>
    </View>
  );
}
