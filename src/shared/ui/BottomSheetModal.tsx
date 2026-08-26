import type { ReactNode } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "./colors";

const ANIMATION_DURATION_MS = 250;

export type BottomSheetModalRef = {
  present: () => void;
  dismiss: () => void;
};

type BottomSheetModalProps = {
  children: ReactNode;
};

export const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
  function BottomSheetModalComponent({ children }, ref) {
    const isDarkMode = useColorScheme() === "dark";
    const [isVisible, setIsVisible] = useState(false);
    const { top } = useSafeAreaInsets();
    const sheetHeight = Dimensions.get("window").height - top;
    const translateY = useRef(new Animated.Value(sheetHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const animateIn = useCallback(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    }, [backdropOpacity, translateY]);

    const animateOut = useCallback(
      (onComplete?: () => void) => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: sheetHeight,
            duration: ANIMATION_DURATION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: ANIMATION_DURATION_MS,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsVisible(false);
          onComplete?.();
        });
      },
      [backdropOpacity, sheetHeight, translateY],
    );

    const present = useCallback(() => {
      setIsVisible(true);
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
      requestAnimationFrame(animateIn);
    }, [animateIn, backdropOpacity, sheetHeight, translateY]);

    const dismiss = useCallback(() => animateOut(), [animateOut]);

    useImperativeHandle(ref, () => ({ present, dismiss }), [dismiss, present]);

    if (!isVisible) return null;

    return (
      <Modal transparent visible={isVisible} animationType="none" onRequestClose={dismiss}>
        <View className="flex-1 justify-end">
          <Animated.View style={{ opacity: backdropOpacity }} className="absolute inset-0 bg-black/30">
            <Pressable className="flex-1" onPress={dismiss} />
          </Animated.View>
          <Animated.View
            style={{
              height: sheetHeight,
              transform: [{ translateY }],
              backgroundColor: isDarkMode ? colors.neutral800 : colors.white,
            }}
            className="overflow-hidden rounded-t-3xl"
          >
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  },
);
