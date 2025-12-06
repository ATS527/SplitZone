import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "../context/ToastContext";
import { type AuthFormData, authSchema } from "../lib/validations/auth";

export default function Auth() {
	const { signIn } = useAuthActions();
	const router = useRouter();
	const toast = useToast();
	const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");

	const { control, handleSubmit, clearErrors } = useForm<AuthFormData>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const toggleFlow = () => {
		const newFlow = flow === "signIn" ? "signUp" : "signIn";
		setFlow(newFlow);
		clearErrors();
	};

	const onSubmit = async (data: AuthFormData) => {
		try {
			await signIn("password", {
				email: data.email,
				password: data.password,
				flow: flow,
			});
			toast.success("Successfully logged in!");
			router.replace("/");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		}
	};

	return (
		<View className="flex-1 items-center justify-center bg-white p-8">
			<Text className="mb-8 text-3xl font-bold text-gray-900">
				{flow === "signIn" ? "Welcome Back" : "Create Account"}
			</Text>

			<View className="w-full max-w-sm space-y-4">
				<View>
					<Controller
						control={control}
						name="email"
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<TextInput
									className="w-full rounded-lg border border-gray-300 p-4 text-lg"
									placeholder="Email"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
								{error && (
									<Text className="mt-1 text-sm text-red-500">
										{error.message}
									</Text>
								)}
							</>
						)}
					/>
				</View>

				<View>
					<Controller
						control={control}
						name="password"
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<TextInput
									className="w-full rounded-lg border border-gray-300 p-4 text-lg"
									placeholder="Password"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									secureTextEntry
								/>
								{error && (
									<Text className="mt-1 text-sm text-red-500">
										{error.message}
									</Text>
								)}
							</>
						)}
					/>
				</View>

				<TouchableOpacity
					onPress={handleSubmit(onSubmit)}
					className="w-full rounded-lg bg-blue-600 p-4"
				>
					<Text className="text-center text-lg font-bold text-white">
						{flow === "signIn" ? "Sign In" : "Sign Up"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleFlow} className="mt-4">
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
