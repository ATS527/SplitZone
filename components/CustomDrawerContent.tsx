import { useAuthActions } from "@convex-dev/auth/react";
import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { useQuery } from "convex/react";
import { LogOut, Moon, Sun, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../convex/_generated/api";

export default function CustomDrawerContent(
	props: DrawerContentComponentProps,
) {
	const { signOut } = useAuthActions();
	const { bottom } = useSafeAreaInsets();
	const user = useQuery(api.users.viewer);
	const { colorScheme, toggleColorScheme } = useColorScheme();

	return (
		<View className="flex-1 bg-background">
			<DrawerContentScrollView {...props} scrollEnabled={false}>
				<View className="px-4 pt-2 pb-6">
					<Text className="text-2xl font-bold text-primary">SplitZone</Text>
				</View>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>

			<View
				className="p-4 border-t border-border"
				style={{ paddingBottom: 20 + bottom }}
			>
				<View className="mb-6 flex-row items-center justify-between">
					<View className="flex-row items-center space-x-2">
						{colorScheme === "dark" ? (
							<Moon size={20} className="text-muted-foreground" />
						) : (
							<Sun size={20} className="text-muted-foreground" />
						)}
						<Text className="font-medium text-muted-foreground">Dark Mode</Text>
					</View>
					<Switch
						value={colorScheme === "dark"}
						onValueChange={toggleColorScheme}
						trackColor={{ false: "#767577", true: "#2563EB" }}
						thumbColor={"#f4f3f4"}
					/>
				</View>
				<View className="mb-2 flex-row items-center">
					<View className="h-10 w-10 items-center justify-center rounded-full bg-secondary mr-2">
						<User size={20} className="text-primary" />
					</View>
					<View>
						<Text className="font-semibold text-foreground">
							{user?.name ?? "Account"}
						</Text>
						<Text className="text-sm text-muted-foreground">
							{user?.email ?? "Loading..."}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => signOut()}
						className="ml-auto flex-row items-center rounded-lg active:bg-red-50 dark:active:bg-red-900/10"
					>
						<LogOut size={20} color="#EF4444" />
						<Text className="ml-3 font-medium text-red-500">Sign Out</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
