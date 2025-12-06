import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { ToastProvider } from "../context/ToastContext";
import "../global.css";

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
	return (
		<ConvexAuthProvider
			client={convex}
			storage={
				Platform.OS === "android" || Platform.OS === "ios"
					? secureStorage
					: undefined
			}
		>
			<ToastProvider>
				<RootLayoutNav />
			</ToastProvider>
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
			router.replace("/");
		}
	}, [isAuthenticated, isLoading, segments, router]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#2563EB" />
			</View>
		);
	}

	return (
		<Stack>
			<Stack.Screen name="index" />
			<Stack.Screen name="auth" options={{ headerShown: false }} />
		</Stack>
	);
}
