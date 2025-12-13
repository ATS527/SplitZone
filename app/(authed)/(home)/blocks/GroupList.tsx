import { ChevronRight } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface GroupListProps {
	groups: Doc<"groups">[];
}

export function GroupList({ groups }: GroupListProps) {
	return (
		<FlatList
			data={groups}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ paddingBottom: 100 }}
			renderItem={({ item }) => (
				<TouchableOpacity className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm active:bg-accent">
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-lg font-bold text-foreground">
								{item.name}
							</Text>
							{item.description && (
								<Text
									className="mt-1 text-sm text-muted-foreground"
									numberOfLines={1}
								>
									{item.description}
								</Text>
							)}
						</View>
						<ChevronRight
							size={20}
							className="text-muted-foreground"
							color="hsl(240 3.8% 46.1%)"
						/>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
}
