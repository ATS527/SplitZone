import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
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
			<Stack>
				<Stack.Screen name="index" />
			</Stack>
		</ConvexAuthProvider>
	);
}
