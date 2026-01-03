import {
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

interface PayerSelectionModalProps {
	visible: boolean;
	onClose: () => void;
	members: Array<{
		userId: string;
		user: {
			_id: string;
			name?: string;
			email?: string;
		} | null;
	}>;
	paidBy: string | null;
	onSelectPayer: (userId: string) => void;
}

export function PayerSelectionModal({
	visible,
	onClose,
	members,
	paidBy,
	onSelectPayer,
}: PayerSelectionModalProps) {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
				<View className="flex-1 justify-end bg-black/50">
					<TouchableWithoutFeedback>
						<View className="rounded-t-3xl bg-background p-6 pb-10">
							<View className="mb-4 flex-row items-center justify-between">
								<Text className="text-xl font-bold text-foreground">
									Select Payer
								</Text>
								<TouchableOpacity onPress={onClose}>
									<Text className="text-primary">Close</Text>
								</TouchableOpacity>
							</View>
							<ScrollView className="max-h-96">
								{members.map((member) => (
									<TouchableOpacity
										key={member.userId}
										onPress={() => {
											if (member.user) {
												onSelectPayer(member.user._id);
												onClose();
											}
										}}
										className={`mb-2 flex-row items-center gap-3 rounded-xl p-4 ${
											paidBy === member.user?._id ? "bg-secondary" : "bg-card"
										}`}
									>
										<View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
											<Text className="font-bold text-primary">
												{member.user?.name?.[0]?.toUpperCase() ?? "?"}
											</Text>
										</View>
										<Text
											className={`text-lg ${
												paidBy === member.user?._id
													? "font-bold text-foreground"
													: "text-foreground"
											}`}
										>
											{member.user?.name ?? member.user?.email ?? "Unknown"}
										</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
