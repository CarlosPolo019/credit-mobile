import { useRef } from "react";
import type { FocusEvent, TextInputProps } from "react-native";
import { Text, TextInput, View, useColorScheme } from "react-native";
import { colors } from "./colors";
import { useScrollToInput } from "./Screen";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
  className?: string;
};

export function TextField({ label, error, helperText, className, onFocus, ...props }: TextFieldProps) {
  const isDarkMode = useColorScheme() === "dark";
  const inputRef = useRef<TextInput>(null);
  const scrollToInput = useScrollToInput();

  const handleFocus = (event: FocusEvent) => {
    // Wait a tick so the keyboard has started animating in before measuring
    // where to scroll to — scrolling immediately can undershoot.
    setTimeout(() => scrollToInput?.(inputRef.current), 50);
    onFocus?.(event);
  };

  return (
    <View className={`gap-2 ${className ?? ""}`}>
      <Text className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{label}</Text>
      <TextInput
        ref={inputRef}
        placeholderTextColor={isDarkMode ? colors.neutral400 : colors.gray500}
        className={`min-h-12 rounded-lg border bg-gray-100 px-3 text-gray-900 dark:bg-neutral-900 dark:text-neutral-50 ${
          error ? "border-red-500" : "border-gray-200 dark:border-neutral-800"
        }`}
        onFocus={handleFocus}
        {...props}
      />
      {error ? (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-gray-500 dark:text-neutral-400">{helperText}</Text>
      ) : null}
    </View>
  );
}
