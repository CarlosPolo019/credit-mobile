import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListChecks, PlusCircle } from "lucide-react-native";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableHighlight, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { useSession } from "@/entities/session/SessionContext";
import { countPendingAndFailed } from "@/features/credits/offlineQueue";
import { syncQueuedCredits } from "@/features/credits/offlineSync";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { BottomSheetModal, type BottomSheetModalRef, Screen, colors } from "@/shared/ui";
import { ProfileSheetContent } from "./ProfileSheetContent";

type HomePageProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomePage({ navigation }: HomePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session, logout } = useSession();
  const { isOnline } = useNetworkStatus();
  const displayName = session?.user?.fullName || session?.user?.document || session?.user?.username || "Usuario";
  const [queueCounts, setQueueCounts] = useState({ pending: 0, failed: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const profileSheetRef = useRef<BottomSheetModalRef>(null);

  const refreshQueueCounts = useCallback(async () => {
    setQueueCounts(await countPendingAndFailed());
  }, []);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncQueuedCredits();
    } finally {
      await refreshQueueCounts();
      setIsSyncing(false);
    }
  }, [refreshQueueCounts]);

  useEffect(() => {
    return navigation.addListener("focus", refreshQueueCounts);
  }, [navigation, refreshQueueCounts]);

  useEffect(() => {
    if (isOnline) {
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const hasQueuedCredits = queueCounts.pending + queueCounts.failed > 0;

  return (
    <Screen scroll={false} contentClassName="pt-7">
      <View className="flex-row items-start justify-between pb-8">
        <View>
          <View className="flex-row items-center gap-2">
            <Image source={require("../../../assets/images/fya-mark.png")} className="h-5 w-5" resizeMode="contain" />
            <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Panel operativo</Text>
          </View>
          <Text className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
          <Text className="mt-2 text-gray-500 dark:text-neutral-400">{displayName}</Text>
        </View>

        <TouchableOpacity
          onPress={() => profileSheetRef.current?.present()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Perfil"
          className="relative mt-1"
        >
          <Image
            source={require("../../../assets/images/fya-mark.png")}
            className="h-10 w-10 rounded-full bg-brand-100 dark:bg-neutral-800"
            resizeMode="contain"
          />
          {hasQueuedCredits ? (
            <View className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-600 dark:border-neutral-950" />
          ) : null}
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ActionRow
          title="Registrar crédito"
          caption="Crear solicitud y dejar notificación en cola"
          icon={<PlusCircle color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />}
          onPress={() => navigation.navigate("CreditCreate")}
        />
        <ActionRow
          title="Consultar créditos"
          caption="Buscar, filtrar y ordenar créditos activos"
          icon={<ListChecks color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />}
          onPress={() => navigation.navigate("CreditList")}
        />
      </View>

      <BottomSheetModal ref={profileSheetRef}>
        <ProfileSheetContent
          user={session?.user}
          isOnline={isOnline}
          queueCounts={queueCounts}
          isSyncing={isSyncing}
          onSync={handleSync}
          onLogout={() => {
            profileSheetRef.current?.dismiss();
            logout();
          }}
        />
      </BottomSheetModal>
    </Screen>
  );
}

type ActionRowProps = {
  title: string;
  caption: string;
  icon: ReactNode;
  onPress: () => void;
};

function ActionRow({ title, caption, icon, onPress }: ActionRowProps) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={isDarkMode ? colors.neutral600 : colors.gray300}
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-4 border-t border-gray-200 bg-white py-5 dark:border-neutral-800 dark:bg-neutral-950">
        <View className="size-11 items-center justify-center rounded-full bg-brand-100 dark:bg-neutral-800">{icon}</View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-neutral-50">{title}</Text>
          <Text className="mt-1 text-gray-500 dark:text-neutral-400">{caption}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}
