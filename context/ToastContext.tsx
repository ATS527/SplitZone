import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { Toast } from "../components/ui/Toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	toast: {
		success: (message: string) => void;
		error: (message: string) => void;
		info: (message: string) => void;
		warning: (message: string) => void;
	};
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const addToast = useCallback(
		(message: string, type: ToastType) => {
			const id = Math.random().toString(36).substring(7);
			setToasts((prev) => [...prev, { id, message, type }]);

			// Auto dismiss
			setTimeout(() => {
				removeToast(id);
			}, 3000);
		},
		[removeToast],
	);

	const toast = {
		success: (message: string) => addToast(message, "success"),
		error: (message: string) => addToast(message, "error"),
		info: (message: string) => addToast(message, "info"),
		warning: (message: string) => addToast(message, "warning"),
	};

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<Toast toasts={toasts} onDismiss={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context.toast;
}
