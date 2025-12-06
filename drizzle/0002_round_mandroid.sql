CREATE TABLE "tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"schema_name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "tenant_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tenant_schema_name_unique" UNIQUE("schema_name")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tenant_id" text;--> statement-breakpoint
INSERT INTO "tenant" ("id", "name", "slug", "schema_name", "created_at")
VALUES ('default', 'Default Tenant', 'default', 'public', now())
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
UPDATE "user" SET "tenant_id" = 'default' WHERE "tenant_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "tenant_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade ON UPDATE no action;
