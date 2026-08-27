import { LayoutDashboard, Users } from "lucide-react-native";
import { type ReactNode } from "react";
import { Image, Text, TouchableHighlight, View, useColorScheme } from "react-native";
import type { TabScreenProps } from "@/app/navigation";
import { useSession } from "@/entities/session/SessionContext";
import { Screen, colors } from "@/shared/ui";

type HomePageProps = TabScreenProps<"Home">;

/**
 * Landing tab: a greeting plus, for ADMIN accounts only, quick links to the
 * two admin-only screens that don't have their own bottom tab (Clientes,
 * Dashboard — pushed screens on the root stack, see AppRouter.tsx). Correos
 * got promoted to a 5th bottom tab for admin (MainTabs.tsx), so it's not
 * listed here too. Registrar/Consultar créditos and Perfil moved out to
 * their own tabs, so a non-admin account's Home has nothing left to list —
 * that's expected, not a missing state.
 */
export function HomePage({ navigation }: HomePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const displayName = session?.user?.fullName || session?.user?.document || session?.user?.username || "Usuario";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <Screen scroll={false} contentClassName="pt-7 pb-28">
      <View className="pb-8">
        <View className="flex-row items-center gap-2">
          <Image source={require("../../../assets/images/fya-mark.png")} className="h-5 w-5" resizeMode="contain" />
          <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Panel operativo</Text>
        </View>
        <Text className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">{displayName}</Text>
      </View>

      <View className="flex-1">
        {isAdmin ? (
          <>
            <ActionRow
              title="Clientes"
              caption="Directorio de clientes registrados"
              icon={<Users color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />}
              onPress={() => navigation.navigate("ClientList")}
            />
            <ActionRow
              title="Dashboard"
              caption="Créditos por comercial, montos y correos"
              icon={<LayoutDashboard color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />}
              onPress={() => navigation.navigate("Dashboard")}
            />
          </>
        ) : (
          <Text className="border-t border-gray-200 py-5 text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
            Usa las pestañas de abajo para registrar o consultar créditos.
          </Text>
        )}
      </View>
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
