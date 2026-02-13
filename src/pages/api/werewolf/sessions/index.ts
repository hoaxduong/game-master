import { getAuth } from "@/lib/auth";
import { werewolfSessions } from "@/db/schema";
import type { APIRoute } from "astro";
import { desc, eq, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export const GET: APIRoute = async (ctx) => {
  const auth = getAuth(ctx.locals.runtime.env.DB);
  const session = await auth.api.getSession({ headers: ctx.request.headers });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = drizzle(ctx.locals.runtime.env.DB);
  const url = new URL(ctx.request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  // Get total count
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(werewolfSessions)
    .where(eq(werewolfSessions.userId, session.user.id));

  // Get sessions
  const sessions = await db
    .select({
      id: werewolfSessions.id,
      updatedAt: werewolfSessions.updatedAt,
      state: werewolfSessions.state,
    })
    .from(werewolfSessions)
    .where(eq(werewolfSessions.userId, session.user.id))
    .orderBy(desc(werewolfSessions.updatedAt))
    .limit(limit)
    .offset(offset);

  // Map to summaries
  const items = sessions.map((s) => {
    const state = typeof s.state === "string" ? JSON.parse(s.state) : s.state;
    // @ts-ignore
    const settings = state.settings || {};
    // @ts-ignore
    const players = state.players || [];
    // @ts-ignore
    const aliveCount = players.filter((p: any) => p.isAlive).length;
    const totalCount = players.length;

    return {
      id: s.id,
      updatedAt: s.updatedAt,
      summary: {
        cycle: settings.cycle || 0,
        phase: settings.phase || "unknown",
        status: settings.status || "setup",
        aliveCount,
        totalCount,
      },
    };
  });

  return new Response(
    JSON.stringify({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
