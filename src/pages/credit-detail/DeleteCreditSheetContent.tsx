import { Text, View } from "react-native";
import { Button } from "@/shared/ui";

type DeleteCreditSheetContentProps = {
  clientName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export function DeleteCreditSheetContent({ clientName, onCancel, onConfirm, isSubmitting }: DeleteCreditSheetContentProps) {
  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="items-center py-4">
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">¿Eliminar este crédito?</Text>
        <Text className="mt-2 text-center text-sm text-gray-500 dark:text-neutral-400">
          Se eliminará el crédito de {clientName}. Esta acción no se puede deshacer desde la app.
        </Text>
      </View>

      <View className="mt-auto gap-3 pb-4 pt-6">
        <Button title="Eliminar" variant="danger" onPress={onConfirm} loading={isSubmitting} />
        <Button title="Cancelar" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
      </View>
    </View>
  );
}
