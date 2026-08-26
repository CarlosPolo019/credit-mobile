import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "@/entities/session/SessionContext";
import { colors } from "@/shared/ui";
import { AppRouter } from "./AppRouter";

export function App() {
  const isDarkMode = useColorScheme() === "dark";
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: isDarkMode ? colors.neutral800 : colors.white,
      primary: isDarkMode ? colors.brand400 : colors.brand700,
    },
  };

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppRouter />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

export default App;
