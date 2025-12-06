import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tenant = pgTable("tenant", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  schemaName: text("schema_name").notNull().unique(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

