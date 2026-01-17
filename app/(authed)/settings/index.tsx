import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import { ChevronRight, Image as ImageIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import {
	ActionSheetModal,
	type ActionSheetOption,
} from "../../../components/ui/ActionSheetModal";
import { FormModal } from "../../../components/ui/FormModal";
import UserAvatar from "../../../components/ui/UserAvatar";
import { useToast } from "../../../context/ToastContext";
import { api } from "../../../convex/_generated/api";

const settingsSchema = z.object({
	name: z.optional(z.string().min(3, "Name must be at least 3 characters")),
	phone: z.optional(z.string()),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
	const { colorScheme } = useColorScheme();
	const user = useQuery(api.users.getCurrentlyLoggedInUser);
	const updateUserProfile = useMutation(api.users.updateUserProfile);
	const generateUploadUrl = useMutation(api.users.generateUploadUrl);
	const updateUserImage = useMutation(api.users.updateUserImage);
	const toast = useToast();
	const [isNameModalVisible, setIsNameModalVisible] = useState(false);
	const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SettingsFormData>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: "",
			phone: "",
		},
	});

	useEffect(() => {
		if (user?.name) {
			setValue("name", user.name);
		}
		if (user?.phone) {
			setValue("phone", user.phone);
		}
	}, [user, setValue]);

	const onSubmit = async (data: SettingsFormData) => {
		try {
			await updateUserProfile({ name: data.name, phone: data.phone });
			toast.success("Profile updated successfully!");
			setIsNameModalVisible(false);
			setIsPhoneModalVisible(false);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to update profile",
			);
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			try {
				const postUrl = await generateUploadUrl();
				const response = await fetch(result.assets[0].uri);
				const blob = await response.blob();
				const putResponse = await fetch(postUrl, {
					method: "POST",
					headers: {
						"Content-Type": blob.type,
					},
					body: blob,
				});
				const { storageId } = await putResponse.json();
				await updateUserImage({ storageId });
				toast.success("Image updated successfully!");
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Failed to update image",
				);
			}
		}
	};

	const handleRemoveImage = async () => {
		try {
			await updateUserImage({ storageId: undefined });
			toast.success("Image removed successfully!");
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to remove image",
			);
		}
	};

	const [isAvatarSheetVisible, setIsAvatarSheetVisible] = useState(false);

	const avatarOptions: ActionSheetOption[] = [
		{ label: "Choose from Library", onPress: pickImage },
	];

	if (user?.image) {
		avatarOptions.push({
			label: "Remove Photo",
			onPress: handleRemoveImage,
			isDestructive: true,
		});
	}

	if (!user) {
		return <Redirect href={"/auth"} />;
	}

	return (
		<View className="flex-1 bg-background p-4">
			<Text className="mb-6 text-2xl font-bold text-foreground">Settings</Text>

			<View className="items-center">
				<TouchableOpacity
					onPress={() => setIsAvatarSheetVisible(true)}
					className="group relative h-32 w-32 items-center justify-center rounded-full"
				>
					<UserAvatar
						user={user}
						className="h-full w-full"
						textClassName="text-4xl"
					/>
					<View className="absolute bottom-0 right-0 rounded-full bg-background p-1">
						<View className="rounded-full bg-primary p-2">
							<ImageIcon size={16} className="text-primary-foreground" />
						</View>
					</View>
				</TouchableOpacity>
			</View>

			<View className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
				<TouchableOpacity
					onPress={() => setIsNameModalVisible(true)}
					className="flex-row items-center justify-between p-4 active:bg-accent"
				>
					<View>
						<Text className="text-base font-medium text-foreground">Name</Text>
						<Text className="text-sm text-muted-foreground">
							{user.name ?? "Not set"}
						</Text>
					</View>
					<ChevronRight
						size={20}
						color={
							colorScheme === "dark"
								? "hsl(240 5% 64.9%)"
								: "hsl(240 3.8% 46.1%)"
						}
					/>
				</TouchableOpacity>
				<View className="border-t border-border" />
				<View className="flex-row items-center justify-between p-4">
					<View>
						<Text className="text-base font-medium text-foreground">Email</Text>
						<Text className="text-sm text-muted-foreground">{user.email}</Text>
					</View>
				</View>
				<View className="border-t border-border" />
				<TouchableOpacity
					onPress={() => setIsPhoneModalVisible(true)}
					className="flex-row items-center justify-between p-4 active:bg-accent"
				>
					<View>
						<Text className="text-base font-medium text-foreground">Phone</Text>
						<Text className="text-sm text-muted-foreground">
							{user.phone ?? "Not set"}
						</Text>
					</View>
					<ChevronRight
						size={20}
						color={
							colorScheme === "dark"
								? "hsl(240 5% 64.9%)"
								: "hsl(240 3.8% 46.1%)"
						}
					/>
				</TouchableOpacity>
			</View>

			<FormModal
				visible={isNameModalVisible}
				onClose={() => setIsNameModalVisible(false)}
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

			<FormModal
				visible={isPhoneModalVisible}
				onClose={() => setIsPhoneModalVisible(false)}
				title="Edit Phone Number"
				submitText="Save Changes"
				onSubmit={handleSubmit(onSubmit)}
			>
				<View>
					<Controller
						control={control}
						name="phone"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
								placeholder="Enter your phone number"
								placeholderTextColor="hsl(240 3.8% 46.1%)"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								keyboardType="phone-pad"
								autoFocus
							/>
						)}
					/>
					{errors.phone && (
						<Text className="mt-1 text-sm text-destructive">
							{errors.phone.message}
						</Text>
					)}
				</View>
			</FormModal>

			<ActionSheetModal
				visible={isAvatarSheetVisible}
				title="Profile Photo"
				options={avatarOptions}
				onCancel={() => setIsAvatarSheetVisible(false)}
			/>
		</View>
	);
}
