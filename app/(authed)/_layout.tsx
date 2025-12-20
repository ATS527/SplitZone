import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "../../components/CustomDrawerContent";

export default function DrawerLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				drawerContent={(props) => <CustomDrawerContent {...props} />}
				screenOptions={{
					headerShown: true,
					headerTitle: "SplitZone",
					drawerActiveTintColor: "#2563EB",
				}}
			>
				<Drawer.Screen
					name="(home)"
					options={{
						drawerLabel: "Home",
						title: "SplitZone",
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="(settings)/settings"
					options={{
						drawerLabel: "Settings",
						title: "Settings",
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}
