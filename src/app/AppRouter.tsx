import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "@/entities/session/SessionContext";
import { ClientListPage } from "@/pages/client-list/ClientListPage";
import { CreditDetailPage } from "@/pages/credit-detail/CreditDetailPage";
import { CreditEditPage } from "@/pages/credit-detail/CreditEditPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { LoginPage } from "@/pages/login/LoginPage";
import { syncQueuedCredits } from "@/features/credits/offlineSync";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { colors, OfflineBanner } from "@/shared/ui";
import { BackendWakeGate } from "./BackendWakeGate";
import { MainTabs } from "./MainTabs";
import type { RootStackParamList } from "./navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Headless: fires the offline-credit-queue sync whenever connectivity comes
 * back. Lives here (top of the authenticated tree, always mounted for the
 * whole session) instead of inside a specific tab screen — Home used to own
 * this, but tabs stay mounted only once visited, so a user who never opens
 * a given tab would never get this effect if it lived there.
 */
function AutoSyncOnReconnect() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      syncQueuedCredits();
    }
  }, [isOnline]);

  return null;
}

export function AppRouter() {
  const { isAuthenticated, isRestoring } = useSession();

  if (isRestoring) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
        <ActivityIndicator color={colors.brand700} />
      </View>
    );
  }

  const navigator = (
    <View className="flex-1">
      <OfflineBanner />
      {isAuthenticated ? <AutoSyncOnReconnect /> : null}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="CreditDetail" component={CreditDetailPage} options={{ title: "Detalle de crédito" }} />
            <Stack.Screen name="CreditEdit" component={CreditEditPage} options={{ title: "Editar crédito" }} />
            <Stack.Screen name="ClientList" component={ClientListPage} options={{ title: "Clientes" }} />
            <Stack.Screen name="Dashboard" component={DashboardPage} options={{ title: "Dashboard" }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginPage} options={{ title: "Ingreso" }} />
        )}
      </Stack.Navigator>
    </View>
  );

  // Only the unauthenticated stack waits on the backend — there's no
  // offline login. Once a session exists, the offline credit queue means
  // the authenticated stack shouldn't be blocked on a health check at all.
  return isAuthenticated ? navigator : <BackendWakeGate>{navigator}</BackendWakeGate>;
}
