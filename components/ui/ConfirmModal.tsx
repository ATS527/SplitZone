import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
	visible: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
}

export function ConfirmModal({
	visible,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default",
}: ConfirmModalProps) {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onCancel}
		>
			<View className="flex-1 items-center justify-center bg-black/50 p-4">
				<View className="w-full max-w-sm overflow-hidden rounded-xl bg-background p-6">
					<Text className="mb-2 text-xl font-bold text-foreground">
						{title}
					</Text>
					<Text className="mb-6 text-base text-muted-foreground">
						{message}
					</Text>

					<View className="flex-row justify-end gap-3">
						<TouchableOpacity
							onPress={onCancel}
							className="rounded-lg px-4 py-2"
						>
							<Text className="font-medium text-foreground">{cancelText}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onConfirm}
							className={`rounded-lg px-4 py-2 ${
								variant === "destructive" ? "bg-destructive" : "bg-primary"
							}`}
						>
							<Text
								className={`font-medium ${
									variant === "destructive"
										? "text-destructive-foreground"
										: "text-primary-foreground"
								}`}
							>
								{confirmText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
