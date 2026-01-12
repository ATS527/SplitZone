import { useEffect, useMemo, useState } from "react";
import {
	Modal,
	ScrollView,
	Text,
	TextInput,
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
	const [searchQuery, setSearchQuery] = useState("");

	const filteredMembers = useMemo(() => {
		if (!searchQuery) return members;
		const query = searchQuery.toLowerCase();
		return members.filter((m) => {
			const name = m.user?.name?.toLowerCase() ?? "";
			const email = m.user?.email?.toLowerCase() ?? "";
			return name.includes(query) || email.includes(query);
		});
	}, [members, searchQuery]);

	// Reset search when modal closes
	useEffect(() => {
		if (!visible) {
			setSearchQuery("");
		}
	}, [visible]);

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

							{/* Search Input */}
							<View className="mb-4 flex-row items-center rounded-xl bg-secondary/30 px-3 py-3">
								<TextInput
									className="flex-1 text-base text-foreground"
									placeholder="Search payer..."
									value={searchQuery}
									onChangeText={setSearchQuery}
									autoCorrect={false}
								/>
							</View>

							<ScrollView className="max-h-96">
								{filteredMembers.map((member) => (
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
								{filteredMembers.length === 0 && (
									<Text className="py-4 text-center text-muted-foreground">
										No members found
									</Text>
								)}
							</ScrollView>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}
