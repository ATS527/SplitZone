import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import CreateGroupModal from "./(blocks)/CreateGroupModal";
import EmptyGroupsState from "./(blocks)/EmptyGroupsState";
import GroupDetailsModal from "./(blocks)/GroupDetailsModal";
import GroupList from "./(blocks)/GroupList";

export default function Index() {
	const groups = useQuery(api.groups.listAllGroupsOfLoggedInUser);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | null>(
		null,
	);

	return (
		<View className="flex-1 bg-background p-4">
			{/* Groups List*/}
			{groups === undefined ? (
				<View className="flex-1 items-center justify-center">
					<Text className="text-foreground">Loading...</Text>
				</View>
			) : groups.length === 0 ? (
				<EmptyGroupsState />
			) : (
				<GroupList groups={groups} onGroupPress={setSelectedGroupId} />
			)}

			{/* Floating Action Button */}
			<TouchableOpacity
				onPress={() => setIsCreateModalVisible(true)}
				className="absolute bottom-8 right-8 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
			>
				<Plus size={24} color="white" />
			</TouchableOpacity>

			{/* Create Group Modal */}
			<CreateGroupModal
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
			/>

			{/* Group Details Modal */}
			<GroupDetailsModal
				visible={!!selectedGroupId}
				onClose={() => setSelectedGroupId(null)}
				groupId={selectedGroupId}
			/>
		</View>
	);
}
