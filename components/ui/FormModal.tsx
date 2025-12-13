import { X } from "lucide-react-native";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

interface FormModalProps {
	visible: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	submitText: string;
	onSubmit: () => void;
	isSubmitting?: boolean;
}

export function FormModal({
	visible,
	onClose,
	title,
	children,
	submitText,
	onSubmit,
	isSubmitting = false,
}: FormModalProps) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
			>
				<TouchableOpacity
					style={{ flex: 1 }}
					activeOpacity={1}
					onPress={onClose}
				>
					<View className="flex-1 justify-end bg-black/50">
						<TouchableWithoutFeedback>
							<View className="rounded-t-3xl bg-background p-6">
								<View className="mb-6 flex-row items-center justify-between">
									<Text className="text-xl font-bold text-foreground">
										{title}
									</Text>
									<TouchableOpacity
										onPress={onClose}
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
									{children}

									<TouchableOpacity
										onPress={onSubmit}
										className="w-full rounded-lg bg-primary p-4"
										disabled={isSubmitting}
									>
										<Text className="text-center text-lg font-bold text-primary-foreground">
											{isSubmitting ? "Saving..." : submitText}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</Modal>
	);
}
