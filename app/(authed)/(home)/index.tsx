import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CreateGroupModal from "../../../components/home/CreateGroupModal";
import EmptyGroupsState from "../../../components/home/EmptyGroupsState";
import GroupDetailsModal from "../../../components/home/GroupDetailsModal";
import GroupList from "../../../components/home/GroupList";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function Index() {
	const groups = useQuery(api.groups.listAllGroupsOfLoggedInUser);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | null>(
		null,
	);

	const router = useRouter();
	const { joinGroupId } = useLocalSearchParams();

	// Handle redirect from join screen to preserve back stack
	useEffect(() => {
		if (joinGroupId) {
			const groupId = Array.isArray(joinGroupId) ? joinGroupId[0] : joinGroupId;
			// Clear the param so it doesn't trigger again when navigating back
			router.setParams({ joinGroupId: undefined });
			router.push(`/group/${groupId}`);
		}
	}, [joinGroupId, router]);

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
				<GroupList
					groups={groups}
					onGroupPress={(groupId) => router.push(`/group/${groupId}`)}
					onGroupLongPress={setSelectedGroupId}
				/>
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
