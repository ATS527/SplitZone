import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
	...authTables,
	users: defineTable({
		email: v.string(),
		name: v.string(),
	}).index("email", ["email"]),
});

export default schema;
