import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "@/entities/session/SessionContext";
import { NetworkStatusProvider } from "@/shared/network/NetworkStatusContext";
import { colors } from "@/shared/ui";
import { AppRouter } from "./AppRouter";
import { Splash } from "./Splash";

function AppContent() {
  const [isSplashDone, setIsSplashDone] = useState(false);

  if (!isSplashDone) {
    return <Splash onFinish={() => setIsSplashDone(true)} />;
  }
  return <AppRouter />;
}

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
      <NetworkStatusProvider>
        <SessionProvider>
          <NavigationContainer theme={navigationTheme}>
            <AppContent />
          </NavigationContainer>
        </SessionProvider>
      </NetworkStatusProvider>
    </SafeAreaProvider>
  );
}

export default App;
