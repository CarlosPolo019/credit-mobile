import { Text } from "react-native";

type BannerProps = {
  message?: string;
  type?: "error" | "success";
};

export function Banner({ message, type = "error" }: BannerProps) {
  if (!message) return null;

  const styles = type === "success"
    ? "bg-brand-100 text-brand-700 dark:bg-neutral-800 dark:text-brand-400"
    : "bg-red-50 text-red-600 dark:bg-neutral-900 dark:text-red-400";

  return <Text className={`rounded-lg px-3 py-2 text-sm font-semibold ${styles}`}>{message}</Text>;
}
