import type { Player } from "./store";
import { WEREWOLF_ROLES } from "../types/roles";

export type WinResult = "village" | "werewolves" | "lovers" | null;

/**
 * Check if a win condition has been met.
 *
 * Rules:
 * - Village wins: all werewolves are dead
 * - Werewolves win: alive werewolves >= alive non-werewolves
 * - Lovers win: both lovers are alive, from opposing factions, and everyone else is dead
 * - null: game continues
 */
export function checkWinCondition(
  players: Player[],
  lovers: string[],
): WinResult {
  const alivePlayers = players.filter((p) => p.isAlive);

  // Count alive players by faction
  let aliveWerewolves = 0;
  let aliveVillagers = 0; // includes village + neutral factions

  for (const player of alivePlayers) {
    const role = WEREWOLF_ROLES.find((r) => r.id === player.roleId);
    if (role?.faction === "werewolves") {
      aliveWerewolves++;
    } else {
      aliveVillagers++;
    }
  }

  // Lovers special win: if exactly 2 alive and they are the lovers from opposing factions
  if (
    lovers.length === 2 &&
    alivePlayers.length === 2 &&
    lovers.every((id) => alivePlayers.some((p) => p.id === id))
  ) {
    const lover1 = players.find((p) => p.id === lovers[0]);
    const lover2 = players.find((p) => p.id === lovers[1]);
    const faction1 = WEREWOLF_ROLES.find(
      (r) => r.id === lover1?.roleId,
    )?.faction;
    const faction2 = WEREWOLF_ROLES.find(
      (r) => r.id === lover2?.roleId,
    )?.faction;

    if (faction1 && faction2 && faction1 !== faction2) {
      return "lovers";
    }
  }

  // Village wins: all werewolves eliminated
  if (aliveWerewolves === 0) {
    return "village";
  }

  // Werewolves win: werewolves >= village faction
  if (aliveWerewolves >= aliveVillagers) {
    return "werewolves";
  }

  return null;
}
