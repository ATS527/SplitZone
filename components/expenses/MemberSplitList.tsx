import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { SplitType } from "./SplitTypeSelector";

interface MemberSplitListProps {
	members: Array<{
		userId: string;
		user: {
			name?: string;
			email?: string;
		} | null;
	}>;
	splitType: SplitType;
	selectedMembers: Set<string>;
	memberValues: Record<string, string>;
	splitDetails: Record<string, { value: string; displayAmount: string }>;
	onToggleMember: (userId: string) => void;
	onUpdateValue: (userId: string, value: string) => void;
}

export function MemberSplitList({
	members,
	splitType,
	selectedMembers,
	memberValues,
	splitDetails,
	onToggleMember,
	onUpdateValue,
}: MemberSplitListProps) {
	return (
		<View className="mb-32 space-y-3">
			{members.map((member) => (
				<View
					key={member.userId}
					className="flex-row items-center justify-between rounded-xl bg-card p-3"
				>
					<View className="flex-row items-center gap-3">
						{/* Checkbox for EQUAL */}
						{splitType === "EQUAL" && (
							<TouchableOpacity
								onPress={() => onToggleMember(member.userId)}
								className={`h-6 w-6 items-center justify-center rounded-full border ${
									selectedMembers.has(member.userId)
										? "border-primary bg-primary"
										: "border-muted-foreground"
								}`}
							>
								{selectedMembers.has(member.userId) && (
									<View className="h-3 w-3 rounded-full bg-white" />
								)}
							</TouchableOpacity>
						)}
						<Text className="font-medium text-foreground">
							{member.user?.name ?? member.user?.email ?? "Unknown"}
						</Text>
					</View>

					<View className="flex-row items-center gap-2">
						{/* Input for Non-EQUAL types */}
						{splitType !== "EQUAL" && (
							<TextInput
								className="w-20 rounded-lg bg-secondary/30 p-2 text-right text-foreground"
								keyboardType="numeric"
								placeholder="0"
								value={memberValues[member.userId] || ""}
								onChangeText={(val) => onUpdateValue(member.userId, val)}
							/>
						)}

						{/* Suffix/Symbol */}
						{splitType === "PERCENT" && (
							<Text className="text-muted-foreground">%</Text>
						)}
						{splitType === "SHARES" && (
							<Text className="text-muted-foreground">shares</Text>
						)}

						{/* Calculated Amount Display */}
						{(splitType === "EQUAL" ||
							splitType === "SHARES" ||
							splitType === "PERCENT") && (
							<Text className="w-20 text-right font-medium text-muted-foreground">
								${splitDetails[member.userId]?.displayAmount}
							</Text>
						)}
					</View>
				</View>
			))}
		</View>
	);
}
