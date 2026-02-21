import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 items-center justify-center p-4">
				<Text className="text-2xl font-bold text-foreground mb-2">
					Welcome to SplitZone
				</Text>
				<Text className="text-base text-muted-foreground text-center">
					The UI has been cleared. Start building from scratch!
				</Text>
			</View>
		</SafeAreaView>
	);
}
