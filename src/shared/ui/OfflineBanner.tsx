import { Text, View } from "react-native";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";

export function OfflineBanner() {
  const { status } = useNetworkStatus();
  if (status === "online") return null;

  return (
    <View className="bg-red-600 px-4 py-2">
      <Text className="text-center text-xs font-semibold text-white">
        {status === "offline" ? "Sin conexión a internet" : "Conexión limitada"}
      </Text>
    </View>
  );
}
