import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Single source of truth for both param lists, kept out of AppRouter.tsx /
 * MainTabs.tsx so neither has to import types from the other (they DO
 * import each other's components).
 */
export type TabParamList = {
  Home: undefined;
  CreditList: undefined;
  CreditCreate: undefined;
  // Admin-only tab, conditionally rendered by MainTabs.tsx — still a valid
  // route name for everyone type-wise, just never mounted for a non-admin.
  EmailJobList: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  CreditDetail: { creditId: string };
  CreditEdit: { creditId: string };
  ClientList: undefined;
  Dashboard: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

/**
 * Screens nested inside MainTabs (Home, CreditList, CreditCreate, Profile)
 * need this instead of RootStackScreenProps: it's what lets them call
 * `navigation.navigate("CreditDetail", ...)` — a route that lives one level
 * up, on the root stack — with proper typing, while still typing their own
 * tab route correctly.
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
