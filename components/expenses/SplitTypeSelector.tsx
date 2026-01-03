import { Text, TouchableOpacity, View } from "react-native";

export type SplitType = "EQUAL" | "EXACT" | "PERCENT" | "SHARES";

interface SplitTypeSelectorProps {
	selectedType: SplitType;
	onSelectType: (type: SplitType) => void;
}

export function SplitTypeSelector({
	selectedType,
	onSelectType,
}: SplitTypeSelectorProps) {
	const types: SplitType[] = ["EQUAL", "EXACT", "PERCENT", "SHARES"];

	return (
		<View className="mb-4">
			<Text className="mb-3 text-sm font-medium text-muted-foreground">
				Split method
			</Text>
			<View className="flex-row rounded-lg bg-secondary/30 p-1">
				{types.map((type) => (
					<TouchableOpacity
						key={type}
						onPress={() => onSelectType(type)}
						className={`flex-1 items-center rounded-md py-2 ${
							selectedType === type ? "bg-background shadow-sm" : ""
						}`}
					>
						<Text
							className={`text-xs font-medium ${
								selectedType === type
									? "text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{type}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}
