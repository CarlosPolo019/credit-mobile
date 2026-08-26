import type { ReactNode } from "react";
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme } from "react-native";
import { colors } from "./colors";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
};

const containerClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600",
  secondary: "border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
  ghost: "bg-transparent",
  danger: "bg-red-600",
};

const textClasses: Record<ButtonVariant, string> = {
  // Dark text on the bright brand green reads better than white — same
  // pairing as the primary CTA on credit-web.
  primary: "text-ink",
  secondary: "text-gray-900 dark:text-neutral-50",
  ghost: "text-brand-700 dark:text-brand-400",
  danger: "text-white",
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  icon,
  className,
}: ButtonProps) {
  const isDarkMode = useColorScheme() === "dark";
  const disabledClass = disabled || loading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      accessibilityRole="button"
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-lg px-4 ${containerClasses[variant]} ${disabledClass} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "secondary"
              ? (isDarkMode ? colors.brand400 : colors.brand700)
              : variant === "primary"
                ? colors.ink
                : colors.white
          }
        />
      ) : (
        <>
          {icon}
          <Text className={`text-sm font-semibold ${textClasses[variant]}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
