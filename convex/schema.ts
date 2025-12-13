import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
	...authTables,
	users: defineTable({
		email: v.string(),
		name: v.string(),
	}).index("email", ["email"]),
	groups: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
	}),
	group_members: defineTable({
		groupId: v.id("groups"),
		userId: v.id("users"),
		role: v.union(v.literal("admin"), v.literal("member")),
	})
		.index("by_group", ["groupId"])
		.index("by_user", ["userId"]),
});

export default schema;
