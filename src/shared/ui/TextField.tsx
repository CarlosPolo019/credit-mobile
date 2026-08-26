import type { TextInputProps } from "react-native";
import { Text, TextInput, View, useColorScheme } from "react-native";
import { colors } from "./colors";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  className?: string;
};

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View className={`gap-2 ${className ?? ""}`}>
      <Text className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{label}</Text>
      <TextInput
        placeholderTextColor={isDarkMode ? colors.neutral400 : colors.gray500}
        className={`min-h-12 rounded-lg border bg-gray-100 px-3 text-gray-900 dark:bg-neutral-900 dark:text-neutral-50 ${
          error ? "border-red-500" : "border-gray-200 dark:border-neutral-800"
        }`}
        {...props}
      />
      {error ? <Text className="text-xs font-semibold text-red-500">{error}</Text> : null}
    </View>
  );
}
