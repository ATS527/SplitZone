import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getStorageItemAsync = async (
	key: string,
): Promise<string | null> => {
	if (Platform.OS === "web") {
		try {
			if (typeof localStorage !== "undefined") {
				return localStorage.getItem(key);
			}
		} catch (e) {
			console.error("Local storage is unavailable:", e);
		}
		return null;
	}
	return await SecureStore.getItemAsync(key);
};

export const setStorageItemAsync = async (
	key: string,
	value: string,
): Promise<void> => {
	if (Platform.OS === "web") {
		try {
			if (typeof localStorage !== "undefined") {
				localStorage.setItem(key, value);
			}
		} catch (e) {
			console.error("Failed to save to local storage:", e);
		}
	} else {
		await SecureStore.setItemAsync(key, value);
	}
};
