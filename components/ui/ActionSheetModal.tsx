import {
	Modal,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export interface ActionSheetOption {
	label: string;
	onPress: () => void;
	isDestructive?: boolean;
}

interface ActionSheetModalProps {
	visible: boolean;
	title?: string;
	options: ActionSheetOption[];
	onCancel: () => void;
}

export function ActionSheetModal({
	visible,
	title,
	options,
	onCancel,
}: ActionSheetModalProps) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onCancel}
		>
			<TouchableOpacity
				style={{ flex: 1 }}
				activeOpacity={1}
				onPress={onCancel}
			>
				<View className="flex-1 justify-end bg-black/50">
					<TouchableWithoutFeedback>
						<View className="rounded-t-3xl bg-background p-4 safe-area-bottom">
							{title && (
								<Text className="mb-4 text-center text-lg font-semibold text-muted-foreground">
									{title}
								</Text>
							)}
							<View className="gap-2">
								{options.map((option) => (
									<TouchableOpacity
										key={option.label}
										onPress={() => {
											onCancel(); // Close modal on selection
											option.onPress();
										}}
										className={`w-full items-center rounded-xl bg-secondary p-4 ${
											option.isDestructive ? "bg-destructive/10" : ""
										}`}
									>
										<Text
											className={`text-lg font-medium ${
												option.isDestructive
													? "text-destructive"
													: "text-foreground"
											}`}
										>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
							<TouchableOpacity
								onPress={onCancel}
								className="mt-4 w-full items-center rounded-xl bg-secondary p-4 active:opacity-80"
							>
								<Text className="text-lg font-bold text-foreground">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
