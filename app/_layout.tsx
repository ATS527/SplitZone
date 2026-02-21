import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ThemeProvider } from "@react-navigation/native";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import { Platform } from "react-native";
import { ToastProvider } from "../context/ToastContext";
import "../global.css";
import { NAV_THEME } from "../lib/nav-theme";

// biome-ignore lint/style/noNonNullAssertion: crashing is fine if env is not present
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
	unsavedChangesWarning: false,
});

const secureStorage = {
	getItem: SecureStore.getItemAsync,
	setItem: SecureStore.setItemAsync,
	removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
	const { colorScheme } = useColorScheme();
	const isDarkColorScheme = colorScheme === "dark";

	return (
		<ConvexAuthProvider
			client={convex}
			storage={
				Platform.OS === "android" || Platform.OS === "ios"
					? secureStorage
					: undefined
			}
		>
			<ThemeProvider
				value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}
			>
				<ToastProvider>
					<Stack>
						<Stack.Screen name="index" options={{ headerShown: false }} />
					</Stack>
				</ToastProvider>
			</ThemeProvider>
		</ConvexAuthProvider>
	);
}
