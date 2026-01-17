import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { TouchableOpacity } from "react-native";

export default function HeaderBack() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const handlePress = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/(authed)/(home)");
		}
	};

	return (
		<TouchableOpacity onPress={handlePress} className="ml-4">
			<ChevronLeft
				size={24}
				className="text-foreground"
				color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
			/>
		</TouchableOpacity>
	);
}
