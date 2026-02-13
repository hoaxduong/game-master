import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export const getAuth = (d1: D1Database) => {
  const db = drizzle(d1, { schema });
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    plugins: [anonymous()],
    secret: import.meta.env.BETTER_AUTH_SECRET,
  });
};
