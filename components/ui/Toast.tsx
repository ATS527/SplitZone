import {
	AlertCircle,
	CheckCircle,
	Info,
	X,
	XCircle,
} from "lucide-react-native";

import { cssInterop } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutUp,
	LinearTransition,
} from "react-native-reanimated";

cssInterop(Animated.View, {
	className: {
		target: "style",
	},
});

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
	toasts: { id: string; message: string; type: ToastType }[];
	onDismiss: (id: string) => void;
}

const icons = {
	success: <CheckCircle size={24} color="#16a34a" />, // green-600
	error: <XCircle size={24} color="#dc2626" />, // red-600
	info: <Info size={24} color="#2563eb" />, // blue-600
	warning: <AlertCircle size={24} color="#ca8a04" />, // yellow-600
};

const bgColors = {
	success: "bg-green-50 border-green-200",
	error: "bg-red-50 border-red-200",
	info: "bg-blue-50 border-blue-200",
	warning: "bg-yellow-50 border-yellow-200",
};

const textColors = {
	success: "text-green-800",
	error: "text-red-800",
	info: "text-blue-800",
	warning: "text-yellow-800",
};

export function Toast({ toasts, onDismiss }: ToastProps) {
	if (toasts.length === 0) return null;

	return (
		<View
			className="absolute left-0 right-0 top-12 z-50 flex items-center space-y-2 p-4"
			style={{ pointerEvents: "box-none" }}
		>
			{toasts.map((t) => (
				<Animated.View
					key={t.id}
					entering={FadeInUp.springify()}
					exiting={FadeOutUp}
					layout={LinearTransition.springify()}
					className={`flex-row items-center w-full max-w-sm p-4 rounded-xl border shadow-sm ${
						bgColors[t.type]
					}`}
				>
					<View className="mr-3">{icons[t.type]}</View>
					<Text
						className={`flex-1 font-medium ${textColors[t.type]}`}
						numberOfLines={2}
					>
						{t.message}
					</Text>
					<TouchableOpacity
						onPress={() => onDismiss(t.id)}
						className="ml-2 p-1 rounded-full opacity-50 active:opacity-100"
					>
						<X size={16} color="#000" />
					</TouchableOpacity>
				</Animated.View>
			))}
		</View>
	);
}
