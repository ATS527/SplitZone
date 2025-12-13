import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { FormModal } from "../../../components/ui/FormModal";
import { useToast } from "../../../context/ToastContext";
import { api } from "../../../convex/_generated/api";

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
		return <Redirect href={"/auth"} />;
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

			<FormModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				title="Edit Name"
				submitText="Save Changes"
				onSubmit={handleSubmit(onSubmit)}
			>
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
			</FormModal>
		</View>
	);
}
