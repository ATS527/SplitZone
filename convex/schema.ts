import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
	...authTables,
	users: defineTable({
		email: v.string(),
		name: v.string(),
		phone: v.optional(v.string()),
		image: v.optional(v.string()),
		emailVerificationTime: v.optional(v.number()),
	}).index("email", ["email"]),
	groups: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		inviteCode: v.optional(v.string()),
	}).index("by_invite_code", ["inviteCode"]),
	group_members: defineTable({
		groupId: v.id("groups"),
		userId: v.id("users"),
		role: v.union(v.literal("admin"), v.literal("member")),
	})
		.index("by_group", ["groupId"])
		.index("by_user", ["userId"]),
});

export default schema;
