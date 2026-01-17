import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ThemeProvider } from "@react-navigation/native";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { ToastProvider } from "../context/ToastContext";
import "../global.css";
import { NAV_THEME } from "../lib/nav-theme";
import { getStorageItemAsync } from "../lib/storage";

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
	const { colorScheme, setColorScheme } = useColorScheme();
	const isDarkColorScheme = colorScheme === "dark";

	useEffect(() => {
		(async () => {
			try {
				const theme = await getStorageItemAsync("theme");
				if (theme === "dark" || theme === "light") {
					setColorScheme(theme);
				}
			} catch (e) {
				console.error("Failed to load theme preference:", e);
			}
		})();
	}, [setColorScheme]);

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
					<RootLayoutNav />
				</ToastProvider>
			</ThemeProvider>
		</ConvexAuthProvider>
	);
}

function RootLayoutNav() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;

		const inAuthScreen = segments[0] === "auth";

		if (!isAuthenticated && !inAuthScreen) {
			router.replace("/auth");
		} else if (isAuthenticated && inAuthScreen) {
			router.replace("/(authed)/(home)");
		}
	}, [isAuthenticated, isLoading, segments, router]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" className="text-primary" />
			</View>
		);
	}

	return (
		<Stack>
			<Stack.Screen name="(authed)" options={{ headerShown: false }} />
			<Stack.Screen name="auth" options={{ headerShown: false }} />
		</Stack>
	);
}
