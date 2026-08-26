import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
};

export function Screen({ children, scroll = true, className, contentClassName }: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>
        <View className={`flex-1 px-6 ${contentClassName ?? ""}`}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>
      <ScrollView className="flex-1" contentContainerClassName={`px-6 ${contentClassName ?? ""}`}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
