import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListChecks, LogOut, PlusCircle } from "lucide-react-native";
import type { ReactNode } from "react";
import { Image, Text, TouchableHighlight, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { useSession } from "@/entities/session/SessionContext";
import { Button, Screen, colors } from "@/shared/ui";

type HomePageProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomePage({ navigation }: HomePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session, logout } = useSession();
  const displayName = session?.user?.fullName || session?.user?.document || session?.user?.username || "Usuario";

  return (
    <Screen scroll={false} contentClassName="pt-7">
      <View className="pb-8">
        <View className="flex-row items-center gap-2">
          <Image source={require("../../../assets/images/fya-mark.png")} className="h-5 w-5" resizeMode="contain" />
          <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Panel operativo</Text>
        </View>
        <Text className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">{displayName}</Text>
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

      <Button
        title="Cerrar sesión"
        variant="secondary"
        icon={<LogOut color={isDarkMode ? colors.neutral400 : colors.gray500} size={18} />}
        onPress={logout}
        className="mb-4"
      />
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
