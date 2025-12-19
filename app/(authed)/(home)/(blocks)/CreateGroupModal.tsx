import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { z } from "zod";
import { FormModal } from "../../../../components/ui/FormModal";
import { useToast } from "../../../../context/ToastContext";
import { api } from "../../../../convex/_generated/api";

const createGroupSchema = z.object({
	name: z.string().min(3, "Group name must be at least 3 characters"),
	description: z.string().optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
}

export default function CreateGroupModal({
	visible,
	onClose,
}: CreateGroupModalProps) {
	const createGroup = useMutation(api.groups.createGroup);
	const toast = useToast();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateGroupFormData>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const onSubmit = async (data: CreateGroupFormData) => {
		try {
			await createGroup({
				name: data.name,
				description: data.description,
			});
			toast.success("Group created successfully!");
			onClose();
			reset();
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to create group",
			);
		}
	};

	return (
		<FormModal
			visible={visible}
			onClose={onClose}
			title="Create New Group"
			submitText="Create Group"
			onSubmit={handleSubmit(onSubmit)}
		>
			<View>
				<Text className="mb-2 font-medium text-foreground">Name</Text>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
							placeholder="Group Name"
							placeholderTextColor="hsl(240 3.8% 46.1%)"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize="words"
						/>
					)}
				/>
				{errors.name && (
					<Text className="mt-1 text-sm text-destructive">
						{errors.name.message}
					</Text>
				)}
			</View>

			<View>
				<Text className="mb-2 font-medium text-foreground">
					Description (Optional)
				</Text>
				<Controller
					control={control}
					name="description"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							className="w-full rounded-lg border border-input p-4 text-lg text-foreground placeholder:text-muted-foreground"
							placeholder="What's this group for?"
							placeholderTextColor="hsl(240 3.8% 46.1%)"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							multiline
							numberOfLines={3}
							style={{ textAlignVertical: "top" }}
						/>
					)}
				/>
			</View>
		</FormModal>
	);
}
