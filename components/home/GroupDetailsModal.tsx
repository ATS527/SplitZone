import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { setStringAsync } from "expo-clipboard";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { z } from "zod";
import { useToast } from "../../context/ToastContext";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { FormModal } from "../ui/FormModal";

interface GroupDetailsModalProps {
	visible: boolean;
	onClose: () => void;
	groupId: Id<"groups"> | null;
}

const inviteUserSchema = z.object({
	email: z.email("Invalid email address"),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

export default function GroupDetailsModal({
	visible,
	onClose,
	groupId,
}: GroupDetailsModalProps) {
	const toast = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const group = useQuery(
		api.groups.getGroupDetails,
		groupId ? { groupId } : "skip",
	);
	const searchResults = useQuery(api.users.searchUserByEmail, {
		search: searchQuery,
	});
	const addMember = useMutation(api.groups.addMemberToGroup);
	const inviteCode = useQuery(
		api.groups.getGroupInviteCode,
		groupId ? { groupId } : "skip",
	);
	const generateInviteCode = useMutation(api.groups.generateInviteCode);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<InviteUserFormData>({
		resolver: zodResolver(inviteUserSchema),
		defaultValues: {
			email: "",
		},
	});

	const onInvite = async (data: InviteUserFormData) => {
		if (!groupId || !searchResults) return;

		const userToInvite = searchResults.find((u) => u.email === data.email);

		if (!userToInvite) {
			toast.error("User not found");
			return;
		}

		try {
			await addMember({
				groupId,
				userId: userToInvite._id,
			});
			toast.success("User invited successfully!");
			reset();
			setSearchQuery("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to invite user");
		}
	};

	const onGenerateLink = async () => {
		if (!groupId) return;
		try {
			await generateInviteCode({ groupId });
			toast.success("Invite link generated!");
		} catch (err) {
			toast.error("Failed to generate link");
		}
	};

	const onCopyLink = async () => {
		if (!inviteCode) return;
		const link = `http://localhost:8081/join/${inviteCode}`;
		await setStringAsync(link);
		toast.success("Link copied to clipboard!");
	};

	if (!group) return null;

	return (
		<FormModal
			visible={visible}
			onClose={onClose}
			title={group.name}
			submitText="Done"
			onSubmit={onClose}
		>
			<View className="mb-6">
				<Text className="text-sm text-muted-foreground">
					{group.description}
				</Text>
			</View>

			<View className="mb-6">
				<Text className="mb-2 font-medium text-foreground">Members</Text>
				<FlatList
					data={group.members}
					keyExtractor={(item) => item.userId}
					scrollEnabled={false}
					renderItem={({ item }) => (
						<View className="mb-2 flex-row items-center justify-between rounded-lg border border-border bg-card p-3">
							<View>
								<Text className="font-medium text-foreground">
									{item.user?.name}
								</Text>
								<Text className="text-xs text-muted-foreground">
									{item.user?.email}
								</Text>
							</View>
							<Text className="text-xs capitalize text-muted-foreground">
								{item.role}
							</Text>
						</View>
					)}
				/>
			</View>

			<View>
				<Text className="mb-2 font-medium text-foreground">Invite Member</Text>
				<View className="flex-row gap-2">
					<View className="flex-1">
						<Controller
							control={control}
							name="email"
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									className="w-full rounded-lg border border-input p-3 text-foreground placeholder:text-muted-foreground"
									placeholder="user@example.com"
									placeholderTextColor="hsl(240 3.8% 46.1%)"
									onBlur={onBlur}
									onChangeText={(text) => {
										onChange(text);
										setSearchQuery(text);
									}}
									value={value}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							)}
						/>
					</View>
					<TouchableOpacity
						onPress={handleSubmit(onInvite)}
						className="items-center justify-center rounded-lg bg-primary px-4"
					>
						<Text className="font-medium text-primary-foreground">Invite</Text>
					</TouchableOpacity>
				</View>
				{errors.email && (
					<Text className="mt-1 text-sm text-destructive">
						{errors.email.message}
					</Text>
				)}
			</View>

			<View className="mt-6">
				<Text className="mb-2 font-medium text-foreground">
					Invite via Link
				</Text>
				<View className="flex-row gap-2">
					<View className="flex-1 justify-center rounded-lg border border-input bg-background p-3">
						<Text className="text-foreground" numberOfLines={1}>
							{inviteCode
								? `http://localhost:8081/join/${inviteCode}`
								: "No invite link generated yet"}
						</Text>
					</View>
					{inviteCode ? (
						<TouchableOpacity
							onPress={onCopyLink}
							className="items-center justify-center rounded-lg bg-secondary px-4"
						>
							<Text className="font-medium text-secondary-foreground">
								Copy
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={onGenerateLink}
							className="items-center justify-center rounded-lg bg-primary px-4"
						>
							<Text className="font-medium text-primary-foreground">
								Generate
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</FormModal>
	);
}
