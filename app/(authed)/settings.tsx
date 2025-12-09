import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ChevronRight, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { z } from "zod";
import { useToast } from "../../context/ToastContext";
import { api } from "../../convex/_generated/api";

const settingsSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
	const user = useQuery(api.users.viewer);
	const updateUser = useMutation(api.users.update);
	const toast = useToast();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SettingsFormData>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: "",
		},
	});

	useEffect(() => {
		if (user?.name) {
			setValue("name", user.name);
		}
	}, [user, setValue]);

	const onSubmit = async (data: SettingsFormData) => {
		try {
			await updateUser({ name: data.name });
			toast.success("Name updated successfully!");
			setIsModalVisible(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update name");
		}
	};

	if (!user) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-foreground">Loading...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-background p-4">
			<Text className="mb-6 text-2xl font-bold text-foreground">Settings</Text>

			<View className="overflow-hidden rounded-xl border border-border bg-card">
				<TouchableOpacity
					onPress={() => setIsModalVisible(true)}
					className="flex-row items-center justify-between p-4 active:bg-accent"
				>
					<View>
						<Text className="text-base font-medium text-foreground">Name</Text>
						<Text className="text-sm text-muted-foreground">{user.name}</Text>
					</View>
					<ChevronRight
						size={20}
						className="text-muted-foreground"
						color="hsl(240 3.8% 46.1%)"
					/>
				</TouchableOpacity>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setIsModalVisible(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1"
				>
					<TouchableOpacity
						style={{ flex: 1 }}
						activeOpacity={1}
						onPress={() => setIsModalVisible(false)}
					>
						<View className="flex-1 justify-end bg-black/50">
							<TouchableWithoutFeedback>
								<View className="rounded-t-3xl bg-background p-6">
									<View className="mb-4 flex-row items-center justify-between">
										<Text className="text-xl font-bold text-foreground">
											Edit Name
										</Text>
										<TouchableOpacity
											onPress={() => setIsModalVisible(false)}
											className="rounded-full p-2 active:bg-accent"
										>
											<X
												size={24}
												className="text-foreground"
												color="hsl(240 10% 3.9%)"
											/>
										</TouchableOpacity>
									</View>

									<View className="space-y-6 pb-2">
										<View>
											<Controller
												control={control}
												name="name"
												render={({ field: { onChange, onBlur, value } }) => (
													<TextInput
														className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
														placeholder="Enter your name"
														placeholderTextColor="hsl(240 3.8% 46.1%)"
														onBlur={onBlur}
														onChangeText={onChange}
														value={value}
														autoCapitalize="words"
														autoFocus
													/>
												)}
											/>
											{errors.name && (
												<Text className="mt-1 text-sm text-destructive">
													{errors.name.message}
												</Text>
											)}
										</View>

										<TouchableOpacity
											onPress={handleSubmit(onSubmit)}
											className="w-full rounded-lg bg-primary p-4"
										>
											<Text className="text-center text-lg font-bold text-primary-foreground">
												Save Changes
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
}
