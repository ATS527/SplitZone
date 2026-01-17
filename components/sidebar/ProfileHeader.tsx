import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { api } from "../../convex/_generated/api";
import UserAvatar from "../ui/UserAvatar";

export default function ProfileHeader() {
	const user = useQuery(api.users.getCurrentlyLoggedInUser);

	return (
		<Link href="/settings" asChild>
			<TouchableOpacity>
				<UserAvatar user={user} className="h-8 w-8" />
			</TouchableOpacity>
		</Link>
	);
}
