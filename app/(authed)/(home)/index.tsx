import { useQuery } from "convex/react";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import { CreateGroupModal } from "./blocks/CreateGroupModal";
import { EmptyGroupsState } from "./blocks/EmptyGroupsState";
import { GroupList } from "./blocks/GroupList";

export default function Index() {
	const groups = useQuery(api.groups.list);
	const [isModalVisible, setIsModalVisible] = useState(false);

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
				<GroupList groups={groups} />
			)}

			{/* Floating Action Button */}
			<TouchableOpacity
				onPress={() => setIsModalVisible(true)}
				className="absolute bottom-8 right-8 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
			>
				<Plus size={24} color="white" />
			</TouchableOpacity>

			{/* Create Group Modal */}
			<CreateGroupModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			/>
		</View>
	);
}
