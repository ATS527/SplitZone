import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function GroupScreen() {
	const { groupId } = useLocalSearchParams();

	return (
		<View className="flex-1 items-center justify-center bg-background">
			<Text className="text-xl font-bold text-foreground">Group Details</Text>
			<Text className="text-muted-foreground">ID: {groupId}</Text>
		</View>
	);
}
