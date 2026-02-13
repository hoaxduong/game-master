import type { APIRoute } from "astro";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { werewolfSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async (ctx) => {
  const id = ctx.url.searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });

  const db = drizzle(ctx.locals.runtime.env.DB);
  const session = await db
    .select()
    .from(werewolfSessions)
    .where(eq(werewolfSessions.id, id))
    .get();

  if (!session) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(session.state), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async (ctx) => {
  // Check auth
  const auth = getAuth(ctx.locals.runtime.env.DB);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await ctx.request.json();
  const sessionId = body.settings?.id;

  if (!sessionId) return new Response("Invalid session data", { status: 400 });

  const db = drizzle(ctx.locals.runtime.env.DB);

  // Check if session exists and belongs to user?
  // For now, allow overwrite if ID matches, but associate with current user

  await db
    .insert(werewolfSessions)
    .values({
      id: sessionId,
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
        // Update owner if needed, or keep original?
        // If anonymous user claims it, maybe update is fine.
        userId: session.user.id,
      },
    });

  return new Response("Saved", { status: 200 });
};
