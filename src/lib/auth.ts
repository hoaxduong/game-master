import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export const getAuth = (env: { DB: D1Database; BETTER_AUTH_SECRET?: string; BETTER_AUTH_URL?: string }) => {
  const db = drizzle(env.DB, { schema });
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    plugins: [anonymous()],
    secret: env.BETTER_AUTH_SECRET || import.meta.env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || import.meta.env.BETTER_AUTH_URL,
  });
};
