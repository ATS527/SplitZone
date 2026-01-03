import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { MemberSplitList } from "../../../../../components/expenses/MemberSplitList";
import { PayerSelectionModal } from "../../../../../components/expenses/PayerSelectionModal";
import {
	type SplitType,
	SplitTypeSelector,
} from "../../../../../components/expenses/SplitTypeSelector";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

export default function AddExpenseScreen() {
	const { groupId } = useLocalSearchParams();
	const router = useRouter();
	const validGroupId = groupId as Id<"groups">;

	// specific queries
	const group = useQuery(api.groups.getGroupDetails, { groupId: validGroupId });
	const currentUser = useQuery(api.users.getCurrentlyLoggedInUser);

	// Form State
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [paidBy, setPaidBy] = useState<string | null>(null);
	const [splitType, setSplitType] = useState<SplitType>("EQUAL");
	const [payerModalVisible, setPayerModalVisible] = useState(false);

	// Split Data State
	const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
		new Set(),
	);
	const [memberValues, setMemberValues] = useState<Record<string, string>>({});

	// Initialize defaults
	useEffect(() => {
		if (currentUser && !paidBy) {
			setPaidBy(currentUser._id);
		}
	}, [currentUser, paidBy]);

	// Initialize selected members when group loads
	useEffect(() => {
		if (group?.members && selectedMembers.size === 0) {
			const allMemberIds = new Set(group.members.map((m) => m.userId));
			setSelectedMembers(allMemberIds);

			// Initialize shares to 1 for everyone
			const initialValues: Record<string, string> = {};
			for (const m of group.members) {
				initialValues[m.userId] = "1";
			}
			setMemberValues(initialValues);
		}
	}, [group?.members, selectedMembers.size]);

	const totalAmount = parseFloat(amount) || 0;

	// Calculate display values
	const splitDetails = useMemo(() => {
		if (!group?.members) return {};
		const details: Record<string, { value: string; displayAmount: string }> =
			{};

		if (splitType === "EQUAL") {
			const count = selectedMembers.size;
			const share = count > 0 ? totalAmount / count : 0;
			for (const m of group.members) {
				const isSelected = selectedMembers.has(m.userId);
				details[m.userId] = {
					value: isSelected ? "true" : "false",
					displayAmount: isSelected ? share.toFixed(2) : "0.00",
				};
			}
		} else if (splitType === "SHARES") {
			let totalShares = 0;
			for (const m of group.members) {
				totalShares += parseFloat(memberValues[m.userId] || "0") || 0;
			}
			for (const m of group.members) {
				const shares = parseFloat(memberValues[m.userId] || "0") || 0;
				const shareAmount =
					totalShares > 0 ? (shares / totalShares) * totalAmount : 0;
				details[m.userId] = {
					value: memberValues[m.userId] || "0",
					displayAmount: shareAmount.toFixed(2),
				};
			}
		} else if (splitType === "PERCENT") {
			for (const m of group.members) {
				const percent = parseFloat(memberValues[m.userId] || "0") || 0;
				const shareAmount = (percent / 100) * totalAmount;
				details[m.userId] = {
					value: memberValues[m.userId] || "0",
					displayAmount: shareAmount.toFixed(2),
				};
			}
		} else if (splitType === "EXACT") {
			for (const m of group.members) {
				const val = memberValues[m.userId] || "";
				details[m.userId] = {
					value: val,
					displayAmount: val || "0.00",
				};
			}
		}

		return details;
	}, [group?.members, splitType, selectedMembers, memberValues, totalAmount]);

	const toggleMember = (userId: string) => {
		const newSet = new Set(selectedMembers);
		if (newSet.has(userId)) {
			newSet.delete(userId);
		} else {
			newSet.add(userId);
		}
		setSelectedMembers(newSet);
	};

	const updateMemberValue = (userId: string, val: string) => {
		setMemberValues((prev) => ({ ...prev, [userId]: val }));
	};

	const handleSave = () => {
		console.log("Saving...", {
			groupId,
			description,
			amount,
			paidBy,
			splitType,
			selectedMembers: Array.from(selectedMembers),
			memberValues,
		});
		router.back();
	};

	if (!group)
		return (
			<View className="flex-1 bg-background pt-20">
				<Text className="text-center text-foreground">Loading...</Text>
			</View>
		);

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen
				options={{
					title: "Add Expense",
					presentation: "modal",
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							className="-ml-4 flex-row items-center p-4"
						>
							<ChevronLeft size={28} className="text-primary" color="#2563EB" />
						</TouchableOpacity>
					),
					headerRight: () => null, // Remove save button from header
				}}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			>
				<ScrollView className="flex-1 p-4">
					{/* Description & Amount */}
					<View className="mb-6 space-y-4">
						<View>
							<Text className="mb-2 text-sm font-medium text-muted-foreground">
								Description
							</Text>
							<TextInput
								className="rounded-xl bg-secondary/30 p-4 text-lg text-foreground"
								placeholder="What is this for?"
								value={description}
								onChangeText={setDescription}
								autoFocus
							/>
						</View>

						<View>
							<Text className="mb-2 text-sm font-medium text-muted-foreground">
								Amount
							</Text>
							<View className="relative">
								<Text className="absolute left-4 top-4 text-lg text-muted-foreground">
									$
								</Text>
								<TextInput
									className="rounded-xl bg-secondary/30 p-4 pl-8 text-lg text-foreground"
									placeholder="0.00"
									keyboardType="numeric"
									value={amount}
									onChangeText={setAmount}
								/>
							</View>
						</View>
					</View>

					{/* Paid By */}
					<View className="mb-6">
						<Text className="mb-3 text-sm font-medium text-muted-foreground">
							Paid by
						</Text>
						<TouchableOpacity
							onPress={() => setPayerModalVisible(true)}
							className="flex-row items-center justify-between rounded-xl bg-secondary/30 p-4"
						>
							<Text className="text-lg font-medium text-foreground">
								{group.members.find((m) => m.userId === paidBy)?.user?.name ??
									"Select Payer"}
							</Text>
							<Text className="text-primary">Change</Text>
						</TouchableOpacity>
					</View>

					<SplitTypeSelector
						selectedType={splitType}
						onSelectType={setSplitType}
					/>

					<MemberSplitList
						members={group.members}
						splitType={splitType}
						selectedMembers={selectedMembers}
						memberValues={memberValues}
						splitDetails={splitDetails}
						onToggleMember={toggleMember}
						onUpdateValue={updateMemberValue}
					/>
				</ScrollView>

				{/* Floating Save Button */}
				<SafeAreaView className="absolute bottom-0 left-0 right-0 bg-background/80 p-4 shadow-lg backdrop-blur-md">
					<TouchableOpacity
						onPress={handleSave}
						disabled={!amount || !description}
						className={`w-full items-center rounded-2xl p-4 shadow-sm ${
							!amount || !description ? "bg-muted" : "bg-primary"
						}`}
					>
						<Text
							className={`text-lg font-bold ${
								!amount || !description
									? "text-muted-foreground"
									: "text-primary-foreground"
							}`}
						>
							Save Expense
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</KeyboardAvoidingView>

			<PayerSelectionModal
				visible={payerModalVisible}
				onClose={() => setPayerModalVisible(false)}
				members={group.members}
				paidBy={paidBy}
				onSelectPayer={setPaidBy}
			/>
		</View>
	);
}
