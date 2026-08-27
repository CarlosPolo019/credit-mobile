import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, ListChecks, Mail, Plus, User } from "lucide-react-native";
import type { ComponentType } from "react";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/shared/ui";

type IconComponent = ComponentType<{ color: string; size: number }>;

const ICONS: Record<string, IconComponent> = {
  Home,
  CreditList: ListChecks,
  CreditCreate: Plus,
  EmailJobList: Mail,
  Profile: User,
};

// "CreditCreate" (Registrar) is rendered as an elevated, filled circle
// instead of a plain icon — with 4 tabs it's the 3rd (visually reads as
// center); with 5 (EmailJobList added for admin) it's the exact middle.
const CENTER_ROUTE = "CreditCreate";

/**
 * Fully custom tabBar (passed to Tab.Navigator's `tabBar` prop) — a floating
 * rounded pill instead of the default edge-to-edge bar, matching the
 * reference design the user shared. Because it's fully custom, React
 * Navigation does NOT reserve space for it automatically: every screen
 * rendered inside MainTabs needs its own bottom clearance so this bar
 * doesn't cover its lowest content (see the `pb-28`-ish padding added to
 * each tab screen).
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const isDarkMode = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: insets.bottom + 16 }]}>
      <View className="flex-row items-center justify-between rounded-full bg-white px-4 py-2.5 dark:bg-neutral-900" style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ICONS[route.name] ?? Home;
          const label = descriptors[route.key]?.options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === CENTER_ROUTE) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={label}
                hitSlop={8}
                className="-mt-9 h-14 w-14 items-center justify-center rounded-full bg-brand-600 dark:bg-brand-400"
                style={styles.centerButton}
              >
                <Icon color={colors.ink} size={26} />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center"
            >
              <Icon color={isFocused ? (isDarkMode ? colors.brand400 : colors.brand700) : (isDarkMode ? colors.neutral400 : colors.gray400)} size={24} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 24,
    right: 24,
  },
  bar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
  },
  centerButton: {
    shadowColor: colors.brand700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
