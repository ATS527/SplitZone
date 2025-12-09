import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import z from "zod";
import { useToast } from "../context/ToastContext";

export const authSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthFormData = z.infer<typeof authSchema>;

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
		<View className="flex-1 items-center justify-center bg-background p-8">
			<Text className="mb-8 text-3xl font-bold text-foreground">
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
									className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
									placeholder="Email"
									placeholderTextColor="hsl(240 3.8% 46.1%)"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
								{error && (
									<Text className="mt-1 text-sm text-destructive">
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
									className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
									placeholder="Password"
									placeholderTextColor="hsl(240 3.8% 46.1%)"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									secureTextEntry
								/>
								{error && (
									<Text className="mt-1 text-sm text-destructive">
										{error.message}
									</Text>
								)}
							</>
						)}
					/>
				</View>

				<TouchableOpacity
					onPress={handleSubmit(onSubmit)}
					className="w-full rounded-lg bg-primary p-4"
				>
					<Text className="text-center text-lg font-bold text-primary-foreground">
						{flow === "signIn" ? "Sign In" : "Sign Up"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleFlow} className="mt-4">
					<Text className="text-center text-primary">
						{flow === "signIn"
							? "Don't have an account? Sign Up"
							: "Already have an account? Sign In"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
