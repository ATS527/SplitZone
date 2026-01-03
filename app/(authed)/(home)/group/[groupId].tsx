import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import GroupDetailsModal from "../../../../components/home/GroupDetailsModal";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function GroupScreen() {
	const { groupId } = useLocalSearchParams();
	const router = useRouter();
	const [detailsModalVisible, setDetailsModalVisible] = useState(false);

	const validGroupId = groupId as Id<"groups">;

	const group = useQuery(api.groups.getGroupDetails, { groupId: validGroupId });

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen
				options={{
					headerTitle: () => (
						<TouchableOpacity
							onPress={() => setDetailsModalVisible(true)}
							className="flex-row items-center"
						>
							<Text className="text-lg font-bold text-foreground">
								{group?.name ?? "Loading..."}
							</Text>
						</TouchableOpacity>
					),
				}}
			/>

			<View className="flex-1 items-center justify-center">
				<Text className="text-muted-foreground">Splits will appear here</Text>
			</View>

			<TouchableOpacity
				onPress={() => router.push(`/group/${groupId}/add-expense`)}
				className="absolute bottom-8 right-8 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
			>
				<Plus size={24} color="white" />
			</TouchableOpacity>

			<GroupDetailsModal
				visible={detailsModalVisible}
				onClose={() => setDetailsModalVisible(false)}
				groupId={validGroupId}
			/>
		</View>
	);
}
