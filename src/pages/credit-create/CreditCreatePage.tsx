import { useState } from "react";
import { Text, View } from "react-native";
import type { TabScreenProps } from "@/app/navigation";
import type { CreditPayload } from "@/entities/credit/types";
import { useSession } from "@/entities/session/SessionContext";
import { createCredit } from "@/features/credits/api";
import { enqueueCredit } from "@/features/credits/offlineQueue";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { Banner, Screen } from "@/shared/ui";
import { CreditForm } from "./CreditForm";

type CreditCreatePageProps = TabScreenProps<"CreditCreate">;

export function CreditCreatePage(_props: CreditCreatePageProps) {
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
    <Screen contentClassName="pb-28">
      <View className="pb-4 pt-6">
        <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Registrar</Text>
        <Text className="mt-1 text-2xl font-bold text-gray-900 dark:text-neutral-50">Nuevo crédito</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">La fecha oficial la genera el backend.</Text>
      </View>

      <Banner message={message} type="success" />

      <View className="pt-4">
        <CreditForm mode="create" salespersonLabel={salespersonLabel} onSubmit={handleSubmit} />
      </View>
    </Screen>
  );
}
