import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "@/entities/session/SessionContext";
import { ClientListPage } from "@/pages/client-list/ClientListPage";
import { CreditCreatePage } from "@/pages/credit-create/CreditCreatePage";
import { CreditDetailPage } from "@/pages/credit-detail/CreditDetailPage";
import { CreditEditPage } from "@/pages/credit-detail/CreditEditPage";
import { CreditListPage } from "@/pages/credit-list/CreditListPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EmailJobListPage } from "@/pages/email-job-list/EmailJobListPage";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { colors, OfflineBanner } from "@/shared/ui";
import { BackendWakeGate } from "./BackendWakeGate";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreditCreate: undefined;
  CreditList: undefined;
  CreditDetail: { creditId: string };
  CreditEdit: { creditId: string };
  ClientList: undefined;
  EmailJobList: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomePage} options={{ title: "Créditos" }} />
            <Stack.Screen name="CreditCreate" component={CreditCreatePage} options={{ title: "Registrar crédito" }} />
            <Stack.Screen name="CreditList" component={CreditListPage} options={{ title: "Consultar créditos" }} />
            <Stack.Screen name="CreditDetail" component={CreditDetailPage} options={{ title: "Detalle de crédito" }} />
            <Stack.Screen name="CreditEdit" component={CreditEditPage} options={{ title: "Editar crédito" }} />
            <Stack.Screen name="ClientList" component={ClientListPage} options={{ title: "Clientes" }} />
            <Stack.Screen name="EmailJobList" component={EmailJobListPage} options={{ title: "Correos" }} />
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
