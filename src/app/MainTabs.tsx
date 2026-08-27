import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSession } from "@/entities/session/SessionContext";
import { CreditCreatePage } from "@/pages/credit-create/CreditCreatePage";
import { CreditListPage } from "@/pages/credit-list/CreditListPage";
import { EmailJobListPage } from "@/pages/email-job-list/EmailJobListPage";
import { HomePage } from "@/pages/home/HomePage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { FloatingTabBar } from "./FloatingTabBar";
import type { TabParamList } from "./navigation";

const Tab = createBottomTabNavigator<TabParamList>();

// Stable reference (module scope, not recreated every MainTabs render) —
// an inline arrow passed directly to `tabBar` trips
// react/no-unstable-nested-components even though it just forwards props.
function renderTabBar(props: BottomTabBarProps) {
  return <FloatingTabBar {...props} />;
}

/**
 * Bottom-tab home for the authenticated app. ADMIN gets 5 tabs: Home,
 * Créditos, Registrar (elevated center button, see FloatingTabBar), Correos
 * and Perfil. A plain USER has no use for Home (it only ever held admin
 * quick-links — see HomePage.tsx) or Correos, so both are omitted and the
 * bar has 3 tabs, landing on Créditos by default. Everything else
 * (CreditDetail/CreditEdit, and the admin-only ClientList/Dashboard, which
 * don't have their own tab) stays on the outer root Stack (AppRouter.tsx)
 * and gets pushed on top of this — same as before, just one level deeper.
 */
export function MainTabs() {
  const { session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={renderTabBar}
      initialRouteName={isAdmin ? "Home" : "CreditList"}
    >
      {isAdmin ? <Tab.Screen name="Home" component={HomePage} options={{ title: "Inicio" }} /> : null}
      <Tab.Screen name="CreditList" component={CreditListPage} options={{ title: "Créditos" }} />
      <Tab.Screen name="CreditCreate" component={CreditCreatePage} options={{ title: "Registrar" }} />
      {isAdmin ? (
        <Tab.Screen name="EmailJobList" component={EmailJobListPage} options={{ title: "Correos" }} />
      ) : null}
      <Tab.Screen name="Profile" component={ProfilePage} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
