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
			inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
		});

		await ctx.db.insert("group_members", {
			groupId,
			userId,
			role: "admin",
		});

		const user = await ctx.db.get(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const groupIds = user.groupIds ?? [];
		await ctx.db.patch(userId, { groupIds: [...groupIds, groupId] });

		return groupId;
	},
});

export const listAllGroupsOfLoggedInUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const user = await ctx.db.get(userId);
		const groupIds = user?.groupIds ?? [];

		const groups = await Promise.all(
			groupIds.map(async (groupId) => {
				const group = await ctx.db.get(groupId);
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
			throw new Error("Not authenticated");
		}

		const group = await ctx.db.get(args.groupId);
		if (!group) {
			throw new Error("Group not found");
		}

		const members = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.collect();

		const hasAccess = members.some((m) => m.userId === userId);
		if (!hasAccess) {
			throw new Error("Not authorized");
		}

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

		const user = await ctx.db.get(args.userId);
		if (user) {
			const groupIds = user.groupIds || [];
			await ctx.db.patch(args.userId, {
				groupIds: [...groupIds, args.groupId],
			});
		}
	},
});

export const getGroupInviteCode = query({
	args: { groupId: v.id("groups") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}

		// Check if user is member of group
		const membership = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.filter((q) => q.eq(q.field("userId"), userId))
			.first();

		if (!membership) {
			return null;
		}

		const group = await ctx.db.get(args.groupId);
		return group?.inviteCode;
	},
});

export const generateInviteCode = mutation({
	args: { groupId: v.id("groups") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		// Check if user is member of group
		const membership = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", args.groupId))
			.filter((q) => q.eq(q.field("userId"), userId))
			.first();

		if (!membership) {
			throw new Error("Not authorized");
		}

		const group = await ctx.db.get(args.groupId);
		if (!group) throw new Error("Group not found");

		if (group.inviteCode) return group.inviteCode;

		const inviteCode = Math.random()
			.toString(36)
			.substring(2, 10)
			.toUpperCase();

		await ctx.db.patch(args.groupId, {
			inviteCode,
		});

		return inviteCode;
	},
});

export const joinGroupViaCode = mutation({
	args: { inviteCode: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const group = await ctx.db
			.query("groups")
			.withIndex("inviteCode", (q) => q.eq("inviteCode", args.inviteCode))
			.first();

		if (!group) {
			throw new Error("Invalid invite code");
		}

		const existingMembership = await ctx.db
			.query("group_members")
			.withIndex("by_group", (q) => q.eq("groupId", group._id))
			.filter((q) => q.eq(q.field("userId"), userId))
			.first();

		if (existingMembership) {
			return group._id; // Already a member, just return groupId
		}

		await ctx.db.insert("group_members", {
			groupId: group._id,
			userId,
			role: "member",
		});

		return group._id;
	},
});
