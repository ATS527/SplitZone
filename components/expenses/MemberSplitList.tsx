import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
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
	onSelectAll: (userIds: string[], select: boolean) => void;
	onUpdateValue: (userId: string, value: string) => void;
}

export function MemberSplitList({
	members,
	splitType,
	selectedMembers,
	memberValues,
	splitDetails,
	onToggleMember,
	onSelectAll,
	onUpdateValue,
}: MemberSplitListProps) {
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

	const allFilteredSelected = useMemo(() => {
		if (filteredMembers.length === 0) return false;
		return filteredMembers.every((m) => selectedMembers.has(m.userId));
	}, [filteredMembers, selectedMembers]);

	const handleSelectAllToggle = () => {
		const userIds = filteredMembers.map((m) => m.userId);
		onSelectAll(userIds, !allFilteredSelected);
	};

	return (
		<View className="mb-32 space-y-3">
			{/* Search and Select All Header */}
			<View className="flex-row items-center gap-2">
				{/* Select All Button */}
				<TouchableOpacity
					onPress={handleSelectAllToggle}
					className="flex-row items-center gap-2 rounded-xl bg-secondary/30 px-3 py-2"
				>
					<View
						className={`h-5 w-5 items-center justify-center rounded border ${
							allFilteredSelected
								? "border-primary bg-primary"
								: "border-muted-foreground"
						}`}
					>
						{allFilteredSelected && (
							<View className="h-3 w-3 rounded-sm bg-white" />
						)}
					</View>
					<Text className="text-sm font-medium text-foreground">All</Text>
				</TouchableOpacity>

				{/* Search Input */}
				<View className="flex-1 flex-row items-center rounded-xl bg-secondary/30 px-3 py-2">
					<Search
						size={20}
						className="mr-2 text-muted-foreground"
						color="gray"
					/>
					<TextInput
						className="flex-1 text-base text-foreground"
						placeholder="Search members..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{filteredMembers.map((member) => (
				<View
					key={member.userId}
					className="flex-row items-center justify-between rounded-xl bg-card p-3"
				>
					<View className="flex-row items-center gap-3">
						{/* Checkbox always available */}
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
						<Text className="font-medium text-foreground">
							{member.user?.name ?? member.user?.email ?? "Unknown"}
						</Text>
					</View>

					<View className="flex-row items-center gap-2">
						{selectedMembers.has(member.userId) ? (
							<>
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
							</>
						) : (
							<Text className="text-sm text-muted-foreground">
								Not involved
							</Text>
						)}
					</View>
				</View>
			))}
			{filteredMembers.length === 0 && (
				<Text className="text-center text-muted-foreground">
					No members found
				</Text>
			)}
		</View>
	);
}
