import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentlyLoggedInUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}
		const user = await ctx.db.get(userId);
		if (!user) {
			return null;
		}
		return {
			_id: user._id,
			email: user.email,
			name: user.name,
			phone: user.phone,
			image: user.image,
		};
	},
});

export const searchUserByEmail = query({
	args: { search: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return [];
		}

		if (!args.search) return [];

		const users = await ctx.db
			.query("users")
			.withIndex("email", (q) => q.eq("email", args.search))
			.collect();

		return users.map((u) => ({
			_id: u._id,
			email: u.email,
			name: u.name,
		}));
	},
});

export const updateUserImage = mutation({
	args: {
		storageId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}
		await ctx.db.patch(userId, {
			image: args.storageId
				? ((await ctx.storage.getUrl(args.storageId)) ?? undefined)
				: undefined,
		});
	},
});

export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});

export const updateUserProfile = mutation({
	args: {
		name: v.optional(v.string()),
		phone: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}
		await ctx.db.patch(userId, {
			name: args.name,
			phone: args.phone,
		});
	},
});

export const updateUserName = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}
		await ctx.db.patch(userId, {
			name: args.name,
		});
	},
});
