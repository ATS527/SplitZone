import { Stack } from "expo-router";
import { View } from "react-native";
import ProfileHeader from "../../../components/sidebar/ProfileHeader";
import HeaderBack from "../../../components/ui/HeaderBack";
import HeaderRight from "../../../components/ui/HeaderRight";

export default function HomeLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "transparent",
				},
				headerTitleStyle: {
					fontWeight: "bold",
				},
				headerRight: () => <HeaderRight />,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "SplitZone",
					headerLeft: () => (
						<View className="ml-4">
							<ProfileHeader />
						</View>
					),
				}}
			/>
			<Stack.Screen
				name="group/[groupId]"
				options={{
					title: "Group Details",
					headerLeft: () => <HeaderBack />,
				}}
			/>
		</Stack>
	);
}
