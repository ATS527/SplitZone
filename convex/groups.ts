import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createGroup = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const groupId = await ctx.db.insert("groups", {
			name: args.name,
			description: args.description,
		});

		await ctx.db.insert("group_members", {
			groupId,
			userId,
			role: "admin",
		});

		return groupId;
	},
});

export const listAllGroupsOfLoggedInUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return [];
		}

		const memberships = await ctx.db
			.query("group_members")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		const groups = await Promise.all(
			memberships.map(async (m) => {
				const group = await ctx.db.get(m.groupId);
				return group;
			}),
		);

		return groups.filter((g) => g !== null);
	},
});

export const getGroupDetails = query({
	args: { groupId: v.id("groups") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}

		const group = await ctx.db.get(args.groupId);
		if (!group) return null;

		const members = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.collect();

		const hasAccess = members.some((m) => m.userId === userId);
		if (!hasAccess) return null;

		const memberDetails = await Promise.all(
			members.map(async (m) => {
				const user = await ctx.db.get(m.userId);
				return {
					...m,
					user,
				};
			}),
		);

		return {
			...group,
			members: memberDetails.filter((m) => m.user !== null),
		};
	},
});

export const addMemberToGroup = mutation({
	args: {
		groupId: v.id("groups"),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		// Check if requester is member of group
		const requesterMembership = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.filter((q) => q.eq(q.field("userId"), userId))
			.first();

		if (!requesterMembership) {
			throw new Error("Not authorized");
		}

		// Check if user is already in group
		const existingMembership = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.filter((q) => q.eq(q.field("userId"), args.userId))
			.first();

		if (existingMembership) {
			throw new Error("User already in group");
		}

		await ctx.db.insert("group_members", {
			groupId: args.groupId,
			userId: args.userId,
			role: "member",
		});
	},
});
