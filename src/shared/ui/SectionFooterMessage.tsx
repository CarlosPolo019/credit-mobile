import type { ReactNode } from "react";
import { Text } from "react-native";

type SectionFooterMessageProps = {
  children: ReactNode;
};

export function SectionFooterMessage({ children }: SectionFooterMessageProps) {
  return <Text className="pb-4 text-center text-gray-500 dark:text-neutral-400">{children}</Text>;
}
