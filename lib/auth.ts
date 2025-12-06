import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema/auth";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification,
        }
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: false,
                defaultValue: "admin",
                fieldName: "role",
            },
            tenantId: {
                type: "string",
                required: true,
                input: false,
                defaultValue: "default",
                fieldName: "tenant_id",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
});
