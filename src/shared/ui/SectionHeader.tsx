import { ArrowDown, ArrowUp } from "lucide-react-native";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { colors } from "./colors";

type SectionHeaderProps = {
  title: string;
  count: number;
  sortOrder?: "asc" | "desc";
  sortLabel?: string;
  onToggleSort?: () => void;
};

export function SectionHeader({
  title,
  count,
  sortOrder,
  sortLabel = "Fecha",
  onToggleSort,
}: SectionHeaderProps) {
  const isDarkMode = useColorScheme() === "dark";
  const ArrowIcon = sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <View className="flex-row items-center justify-between bg-white py-4 dark:bg-neutral-950">
      <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
        {title} ({count})
      </Text>
      {onToggleSort ? (
        <TouchableOpacity onPress={onToggleSort} activeOpacity={0.6} className="flex-row items-center gap-1">
          <Text className="text-xs font-semibold text-brand-700 dark:text-brand-400">{sortLabel}</Text>
          <ArrowIcon color={isDarkMode ? colors.brand400 : colors.brand700} size={14} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
