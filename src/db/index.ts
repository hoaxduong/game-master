import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const getDb = (runtime: any) => {
  // runtime is the Cloudflare runtime object passed from Astro
  return drizzle(runtime.env.DB, { schema });
};
