import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import z from "zod";
import { useToast } from "../context/ToastContext";

const signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	name: z.string().optional(),
});

const signUpSchema = signInSchema.extend({
	name: z.string().min(2, "Name is required"),
});

export type AuthFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
	const { signIn } = useAuthActions();
	const router = useRouter();
	const toast = useToast();
	const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");

	const { control, handleSubmit, clearErrors } = useForm<AuthFormData>({
		resolver: zodResolver(flow === "signIn" ? signInSchema : signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
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
				name: data.name ?? "",
				flow: flow,
			});
			toast.success("Successfully logged in!");
			router.replace("/");
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Something went wrong";
			if (errorMessage.includes("InvalidAccountId")) {
				toast.error("Invalid email or password");
			} else {
				toast.error(errorMessage);
			}
		}
	};

	return (
		<View className="flex-1 items-center justify-center bg-background p-8">
			<Text className="mb-8 text-3xl font-bold text-foreground">
				{flow === "signIn" ? "Welcome Back" : "Create Account"}
			</Text>

			<View className="w-full max-w-sm space-y-4">
				{flow === "signUp" && (
					<View>
						<Controller
							control={control}
							name="name"
							render={({
								field: { onChange, onBlur, value },
								fieldState: { error },
							}) => (
								<>
									<TextInput
										className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
										placeholder="Full Name"
										placeholderTextColor="hsl(240 3.8% 46.1%)"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value ?? ""}
										autoCapitalize="words"
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
				)}

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

				<View className="flex-row items-center my-4">
					<View className="flex-1 h-[1px] bg-border" />
					<Text className="mx-4 text-muted-foreground">or</Text>
					<View className="flex-1 h-[1px] bg-border" />
				</View>

				<TouchableOpacity
					onPress={() => void signIn("google", { redirectTo: "/" })}
					className="w-full flex-row items-center justify-center rounded-lg border border-input bg-background p-4"
				>
					<Text className="text-center text-lg font-bold text-foreground">
						Sign in with Google
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
