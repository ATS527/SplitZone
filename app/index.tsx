import { useAuthActions } from "@convex-dev/auth/react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	const { signOut } = useAuthActions();

	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text className="mb-4 text-xl font-bold text-blue-500">
				Welcome to Nativewind!
			</Text>
			<TouchableOpacity
				onPress={() => signOut()}
				className="rounded-lg bg-red-500 px-6 py-3"
			>
				<Text className="font-semibold text-white">Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
}
