import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HeaderBack from "../../components/ui/HeaderBack";
import HeaderRight from "../../components/ui/HeaderRight";
import HomeTitle from "../../components/ui/HomeTitle";

export default function AuthedLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack
				screenOptions={{
					headerShown: true,
					headerTitle: () => <HomeTitle />,
					headerRight: () => <HeaderRight />,
					headerBackTitle: "Back",
				}}
			>
				<Stack.Screen
					name="(home)"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="settings/index"
					options={{
						title: "Settings",
						headerLeft: () => <HeaderBack />,
					}}
				/>
				<Stack.Screen
					name="join/[code]"
					options={{
						title: "Join Group",
						headerLeft: () => <HeaderBack />,
					}}
				/>
			</Stack>
		</GestureHandlerRootView>
	);
}
