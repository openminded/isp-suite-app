CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin', 'technician');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'admin' NOT NULL;