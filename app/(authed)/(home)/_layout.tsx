import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";

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
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "SplitZone",
					headerLeft: () => <DrawerToggleButton />,
				}}
			/>
			<Stack.Screen
				name="[groupId]"
				options={{
					title: "Group Details",
					headerBackTitle: "Back",
				}}
			/>
		</Stack>
	);
}
