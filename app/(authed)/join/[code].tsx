import { useMutation } from "convex/react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function JoinGroupScreen() {
	const { code } = useLocalSearchParams();
	const inviteCode = Array.isArray(code) ? code[0] : code;
	const joinGroup = useMutation(api.groups.joinGroupViaCode);
	const [status, setStatus] = useState<"joining" | "success" | "error">(
		"joining",
	);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		async function handleJoin() {
			if (!inviteCode) {
				setStatus("error");
				setErrorMessage("Invalid invite link");
				return;
			}

			try {
				const groupId = await joinGroup({ inviteCode });
				setStatus("success");
				// Navigate to the group page
				router.replace({
					pathname: "/(authed)/(home)",
					params: { joinGroupId: groupId },
				});
			} catch (err) {
				setStatus("error");
				setErrorMessage(
					err instanceof Error ? err.message : "Failed to join group",
				);
			}
		}

		handleJoin();
	}, [inviteCode, joinGroup]);

	if (status === "joining") {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Stack.Screen options={{ headerShown: false }} />
				<ActivityIndicator size="large" className="text-primary" />
				<Text className="mt-4 text-foreground">Joining group...</Text>
			</View>
		);
	}

	if (status === "error") {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Stack.Screen options={{ headerShown: false }} />
				<Text className="mb-2 text-xl font-bold text-destructive">Error</Text>
				<Text className="mb-6 text-center text-muted-foreground">
					{errorMessage}
				</Text>
				<TouchableOpacity
					onPress={() => router.replace("/(authed)/(home)")}
					className="rounded-lg bg-primary px-6 py-3"
				>
					<Text className="font-medium text-primary-foreground">
						Go to Home
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return null; // Should redirect on success
}
