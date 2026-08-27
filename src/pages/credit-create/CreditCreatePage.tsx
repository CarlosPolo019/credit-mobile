import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import type { CreditPayload } from "@/entities/credit/types";
import { useSession } from "@/entities/session/SessionContext";
import { createCredit } from "@/features/credits/api";
import { enqueueCredit } from "@/features/credits/offlineQueue";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { Banner, Screen, colors } from "@/shared/ui";
import { CreditForm } from "./CreditForm";

type CreditCreatePageProps = NativeStackScreenProps<RootStackParamList, "CreditCreate">;

export function CreditCreatePage({ navigation }: CreditCreatePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const { isOnline } = useNetworkStatus();
  const [message, setMessage] = useState("");
  const salespersonLabel = session?.user.fullName || session?.user.document || session?.user.username || "";

  const handleSubmit = async (payload: CreditPayload) => {
    setMessage("");
    if (!isOnline) {
      await enqueueCredit(payload);
      setMessage("Crédito guardado offline. Se sincronizará cuando vuelva internet.");
      return true;
    }
    try {
      await createCredit(payload);
      setMessage("Crédito registrado. La notificación quedó en cola.");
      return true;
    } catch {
      setMessage("");
      return false;
    }
  };

  return (
    <Screen contentClassName="pb-8">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Registrar crédito</Text>
      </View>

      <View className="pb-4 pt-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Nuevo crédito</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">La fecha oficial la genera el backend.</Text>
      </View>

      <Banner message={message} type="success" />

      <View className="pt-4">
        <CreditForm mode="create" salespersonLabel={salespersonLabel} onSubmit={handleSubmit} />
      </View>
    </Screen>
  );
}
