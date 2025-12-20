import { Text, View } from "react-native";

export default function EmptyGroupsState() {
	return (
		<View className="flex-1 items-center justify-center">
			<Text className="mb-4 text-xl font-bold text-foreground">
				Welcome to SplitZone!
			</Text>
			<Text className="text-center text-muted-foreground">
				You don't have any groups yet.{"\n"}
				Create a group to get started.
			</Text>
		</View>
	);
}
