import { createContext, useContext, useRef, type ReactNode } from "react";
import { ScrollView, View, findNodeHandle, type TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
};

type ScrollToInputFn = (input: TextInput | null) => void;

const ScreenScrollContext = createContext<ScrollToInputFn | null>(null);

/**
 * Lets a focused TextField inside a scrollable Screen ask to be scrolled
 * into view above the keyboard. A plain ScrollView doesn't do this on its
 * own on Android even with windowSoftInputMode="adjustResize" — resizing
 * the window doesn't imply scrolling to the focused field.
 */
export function useScrollToInput() {
  return useContext(ScreenScrollContext);
}

export function Screen({ children, scroll = true, className, contentClassName }: ScreenProps) {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToInput: ScrollToInputFn = (input) => {
    if (!input) return;
    const handle = findNodeHandle(input);
    if (handle == null) return;
    // Extra offset so the focused field lands with breathing room above the
    // keyboard instead of flush against its edge.
    scrollRef.current?.getScrollResponder()?.scrollResponderScrollNativeHandleToKeyboard(handle, 96, true);
  };

  if (!scroll) {
    return (
      <SafeAreaView className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>
        <View className={`flex-1 px-6 ${contentClassName ?? ""}`}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>
      <ScreenScrollContext.Provider value={scrollToInput}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName={`px-6 ${contentClassName ?? ""}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {children}
        </ScrollView>
      </ScreenScrollContext.Provider>
    </SafeAreaView>
  );
}
