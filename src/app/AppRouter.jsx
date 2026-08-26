import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSession } from "../entities/session/SessionContext.jsx";
import { CreditCreatePage } from "../pages/credit-create/CreditCreatePage.jsx";
import { CreditListPage } from "../pages/credit-list/CreditListPage.jsx";
import { HomePage } from "../pages/home/HomePage.jsx";
import { LoginPage } from "../pages/login/LoginPage.jsx";
import { colors } from "../shared/ui/theme.js";

const Stack = createNativeStackNavigator();

export function AppRouter() {
  const { isAuthenticated, isRestoring } = useSession();

  if (isRestoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: "800" },
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomePage} options={{ title: "Créditos" }} />
          <Stack.Screen name="CreditCreate" component={CreditCreatePage} options={{ title: "Registrar crédito" }} />
          <Stack.Screen name="CreditList" component={CreditListPage} options={{ title: "Consultar créditos" }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginPage} options={{ title: "Ingreso" }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
  },
});
