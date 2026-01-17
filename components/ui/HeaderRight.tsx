import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { setStorageItemAsync } from "../../lib/storage";
import { ConfirmModal } from "./ConfirmModal";

export default function HeaderRight() {
	const { signOut } = useAuthActions();
	const { colorScheme, toggleColorScheme } = useColorScheme();

	const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

	const handleToggleTheme = async () => {
		const newTheme = colorScheme === "dark" ? "light" : "dark";
		toggleColorScheme();
		await setStorageItemAsync("theme", newTheme);
	};

	const handleLogout = () => {
		setIsLogoutModalVisible(true);
	};

	const onConfirmLogout = () => {
		setIsLogoutModalVisible(false);
		signOut();
	};

	return (
		<View className="mr-4 flex-row items-center gap-4">
			<TouchableOpacity onPress={handleToggleTheme}>
				{colorScheme === "dark" ? (
					<Moon size={24} className="text-foreground" color="#FFFFFF" />
				) : (
					<Sun size={24} className="text-foreground" color="#000000" />
				)}
			</TouchableOpacity>
			<TouchableOpacity onPress={handleLogout}>
				<LogOut size={24} className="text-destructive" color="#EF4444" />
			</TouchableOpacity>
			<ConfirmModal
				visible={isLogoutModalVisible}
				title="Log Out"
				message="Are you sure you want to log out?"
				onConfirm={onConfirmLogout}
				onCancel={() => setIsLogoutModalVisible(false)}
				confirmText="Log Out"
				variant="destructive"
			/>
		</View>
	);
}
