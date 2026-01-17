import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function HomeTitle() {
	return (
		<Link href="/(authed)/(home)" asChild>
			<TouchableOpacity>
				<Text className="text-xl font-bold text-foreground">SplitZone</Text>
			</TouchableOpacity>
		</Link>
	);
}
