import { Image, Text, View } from "react-native";

interface UserAvatarProps {
	user:
		| {
				name?: string;
				image?: string;
		  }
		| null
		| undefined;
	className?: string;
	textClassName?: string;
}

export default function UserAvatar({
	user,
	className,
	textClassName,
}: UserAvatarProps) {
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	if (user?.image) {
		return (
			<Image
				source={{ uri: user.image }}
				className={`rounded-full ${className || ""}`}
			/>
		);
	}

	return (
		<View
			className={`items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 ${className || ""}`}
		>
			<Text className={`font-semibold text-primary ${textClassName || ""}`}>
				{getInitials(user?.name)}
			</Text>
		</View>
	);
}
