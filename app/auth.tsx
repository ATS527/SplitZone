import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Auth() {
	const { signIn } = useAuthActions();
	const router = useRouter();
	const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		try {
			setError("");
			await signIn("password", { email, password, flow });
			router.replace("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		}
	};

	return (
		<View className="flex-1 items-center justify-center bg-white p-8">
			<Text className="mb-8 text-3xl font-bold text-gray-900">
				{flow === "signIn" ? "Welcome Back" : "Create Account"}
			</Text>

			<View className="w-full max-w-sm space-y-4">
				{error ? (
					<Text className="mb-4 text-center text-red-500">{error}</Text>
				) : null}

				<TextInput
					className="w-full rounded-lg border border-gray-300 p-4 text-lg"
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
				/>

				<TextInput
					className="w-full rounded-lg border border-gray-300 p-4 text-lg"
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>

				<TouchableOpacity
					onPress={handleSubmit}
					className="w-full rounded-lg bg-blue-600 p-4"
				>
					<Text className="text-center text-lg font-bold text-white">
						{flow === "signIn" ? "Sign In" : "Sign Up"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
					className="mt-4"
				>
					<Text className="text-center text-blue-600">
						{flow === "signIn"
							? "Don't have an account? Sign Up"
							: "Already have an account? Sign In"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
