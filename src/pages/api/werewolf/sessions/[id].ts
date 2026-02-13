import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { werewolfSessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const GET: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  if (!id) return new Response("Missing ID", { status: 400 });

  // Optional: Check auth if sessions are private usage
  const auth = getAuth(ctx.locals.runtime.env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });

  const db = drizzle(ctx.locals.runtime.env.DB);

  // If user is authenticated, check ownership?
  // For anonymous sessions in this app, maybe strict ownership isn't enforced yet,
  // but let's query by ID first.
  const [data] = await db
    .select()
    .from(werewolfSessions)
    .where(eq(werewolfSessions.id, id))
    .limit(1);

  if (!data) return new Response("Not found", { status: 404 });

  // If we want to restrict access to owner:
  // if (session && data.userId !== session.user.id) ...
  // But for now, allow sharing via link logic (public read if you have ID?)
  // Let's stick to simple: if you have ID, you can read.

  return new Response(JSON.stringify(data.state), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  if (!id) return new Response("Missing ID", { status: 400 });

  const auth = getAuth(ctx.locals.runtime.env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await ctx.request.json();
  const db = drizzle(ctx.locals.runtime.env.DB);

  // Upsert session
  await db
    .insert(werewolfSessions)
    .values({
      id: id,
      userId: session.user.id,
      state: body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: werewolfSessions.id,
      set: {
        state: body,
        updatedAt: new Date(),
        userId: session.user.id, // Update owner to current user
      },
    });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
