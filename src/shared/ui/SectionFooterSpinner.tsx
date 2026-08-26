import { ActivityIndicator, View } from "react-native";

export function SectionFooterSpinner() {
  return (
    <View className="py-4">
      <ActivityIndicator />
    </View>
  );
}
