import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Core Tables
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
});

// Game Modules (Generic)
export const games = sqliteTable("games", {
  id: text("id").primaryKey(), // Game session unique ID
  gmId: text("gm_id").references(() => users.id),
  type: text("type").notNull(), // 'werewolf', 'mafia', etc.
  status: text("status").notNull(), // 'lobby', 'playing', 'finished'
  mode: text("mode").notNull(), // 'offline', 'online', 'hybrid'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  gameId: text("game_id").references(() => games.id),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'alive', 'dead', 'spectating'
  role: text("role"), // Dynamic based on game type
  metadata: text("metadata"), // JSON string for role-specific extra data
});

// Werewolf Specific Logs/History (Optional for now, players metadata can store most)
export const werewolfLogs = sqliteTable("werewolf_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: text("game_id").references(() => games.id),
  phase: text("phase").notNull(), // 'day', 'night'
  cycle: integer("cycle").notNull(), // round number
  action: text("action").notNull(), // 'voted', 'killed', 'saved'
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});
