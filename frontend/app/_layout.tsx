import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="register" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="filme-form" options={{ presentation: "card" }} />
            </Stack>
          </AuthProvider>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
