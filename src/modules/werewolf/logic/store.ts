import { atom, map, onMount } from "nanostores";
import type { WerewolfRole } from "../types/roles";
import { calculateNightResults } from "./nightResult";
import { saveSessionToApi, loadSessionFromApi } from "./session-api";

export interface Player {
  id: string;
  name: string;
  roleId?: string;
  isAlive: boolean;
  notes: string;
}

export interface GameSettings {
  id: string;
  status: "setup" | "playing" | "ended";
  phase: "day" | "night";
  cycle: number;
  phaseStepIndex: number;
}

export interface WerewolfState {
  settings: GameSettings;
  players: Player[];
  roles: string[];
  targets: Record<string, string[]>;
  lovers: string[];
  witchPotions: { life: boolean; death: boolean };
  hunterPendingShot: string | null;
  storyId: string;
}

// Stores
export const $gameSettings = map<GameSettings>({
  id: crypto.randomUUID(),
  status: "setup",
  phase: "night",
  cycle: 0,
  phaseStepIndex: 0,
});

// New persistent states
export const $lovers = atom<string[]>([]);
export const $witchPotions = map<{ life: boolean; death: boolean }>({
  life: true,
  death: true,
});
export const $hunterPendingShot = atom<string | null>(null);
export const $selectedStoryId = atom<string>("classic");

// Persistence debounce timer
let saveTimer: ReturnType<typeof setTimeout>;

// Persistence setup
onMount($gameSettings, () => {
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveSessionToApi({
        settings: $gameSettings.get(),
        players: $players.get(),
        roles: $selectedRoleIds.get(),
        targets: $selectedTargets.get(),
        lovers: $lovers.get(),
        witchPotions: $witchPotions.get(),
        hunterPendingShot: $hunterPendingShot.get(),
        storyId: $selectedStoryId.get(),
      });
    }, 1000); // Debounce 1s
  };

  const unsubscribeSettings = $gameSettings.listen(save);
  const unsubscribePlayers = $players.listen(save);
  const unsubscribeRoles = $selectedRoleIds.listen(save);
  const unsubscribeTargets = $selectedTargets.listen(save);
  const unsubscribeLovers = $lovers.listen(save);
  const unsubscribeWitch = $witchPotions.listen(save);
  const unsubscribeHunter = $hunterPendingShot.listen(save);
  const unsubscribeStory = $selectedStoryId.listen(save);

  return () => {
    unsubscribeSettings();
    unsubscribePlayers();
    unsubscribeRoles();
    unsubscribeTargets();
    unsubscribeLovers();
    unsubscribeWitch();
    unsubscribeHunter();
    unsubscribeStory();
  };
});

export const $players = atom<Player[]>([]);
export const $selectedRoleIds = atom<string[]>(["villager", "werewolf"]); // Default roles
export const $selectedTargets = map<Record<string, string[]>>({});

// Actions
export const addPlayer = (name: string) => {
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    name,
    isAlive: true,
    notes: "",
  };
  $players.set([...$players.get(), newPlayer]);
};

export const generatePlayers = (count: number) => {
  const currentCount = $players.get().length;
  const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Player ${currentCount + i + 1}`,
    isAlive: true,
    notes: "",
  }));
  $players.set([...$players.get(), ...newPlayers]);
};

export const removePlayer = (id: string) => {
  $players.set($players.get().filter((p) => p.id !== id));
};

export const updatePlayerName = (id: string, name: string) => {
  $players.set($players.get().map((p) => (p.id === id ? { ...p, name } : p)));
};

export const updatePlayerRole = (id: string, roleId: string | undefined) => {
  $players.set($players.get().map((p) => (p.id === id ? { ...p, roleId } : p)));
};

export const toggleRole = (roleId: string) => {
  const current = $selectedRoleIds.get();
  if (current.includes(roleId)) {
    $selectedRoleIds.set(current.filter((id) => id !== roleId));
  } else {
    $selectedRoleIds.set([...current, roleId]);
  }
};

export const addRole = (roleId: string) => {
  $selectedRoleIds.set([...$selectedRoleIds.get(), roleId]);
};

export const removeRole = (roleId: string) => {
  const current = $selectedRoleIds.get();
  const index = current.lastIndexOf(roleId);
  if (index !== -1) {
    const next = [...current];
    next.splice(index, 1);
    $selectedRoleIds.set(next);
  }
};

export const setStoryVibe = (storyId: string) => {
  $selectedStoryId.set(storyId);
};

export const startGame = async () => {
  const players = $players.get();
  const selectedRoles = $selectedRoleIds.get();

  // 1. Reset all players to unassigned (for mapping phase)
  const resetPlayers = players.map((p) => ({
    ...p,
    roleId: undefined,
  }));

  // 2. Prepare the full role pool (pad with villagers to match player count)
  let finalPool = [...selectedRoles];
  while (finalPool.length < players.length) {
    finalPool.push("villager");
  }

  // If pool is larger than players (e.g. user added too many roles),
  // we trim it to match player count for distribution.
  if (finalPool.length > players.length) {
    finalPool = finalPool.slice(0, players.length);
  }

  $players.set(resetPlayers);
  $selectedRoleIds.set(finalPool);

  // Reset logic states
  $lovers.set([]);
  $witchPotions.set({ life: true, death: true });
  $hunterPendingShot.set(null);

  $gameSettings.setKey("status", "playing");
  $gameSettings.setKey("cycle", 1);
  $gameSettings.setKey("phase", "night");
  $gameSettings.setKey("phaseStepIndex", 0);

  // Immediately save to API to prevent race condition on redirect
  await saveSessionToApi({
    settings: $gameSettings.get(),
    players: $players.get(),
    roles: $selectedRoleIds.get(),
    targets: $selectedTargets.get(),
    lovers: $lovers.get(),
    witchPotions: $witchPotions.get(),
    hunterPendingShot: $hunterPendingShot.get(),
    storyId: $selectedStoryId.get(),
  });
};

export const toggleTarget = (stepId: string, playerId: string) => {
  const current = $selectedTargets.get();
  const stepTargets = current[stepId] || [];
  if (stepTargets.includes(playerId)) {
    $selectedTargets.setKey(
      stepId,
      stepTargets.filter((id) => id !== playerId),
    );
  } else {
    $selectedTargets.setKey(stepId, [...stepTargets, playerId]);
  }
};

export const resetGame = () => {
  // Generate new ID for next game
  const newId = crypto.randomUUID();

  $gameSettings.set({
    id: newId,
    status: "setup",
    phase: "night",
    cycle: 0,
    phaseStepIndex: 0,
  });

  // Reset players to empty
  $players.set([]);
  $selectedTargets.set({});
  $lovers.set([]);
  $witchPotions.set({ life: true, death: true });
  $hunterPendingShot.set(null);
  $selectedRoleIds.set(["villager", "werewolf"]); // Reset to default roles
  $selectedStoryId.set("classic"); // Reset to default story

  // Save the new session state to the API
  saveSessionToApi({
    settings: $gameSettings.get(),
    players: $players.get(),
    roles: $selectedRoleIds.get(),
    targets: $selectedTargets.get(),
    lovers: $lovers.get(),
    witchPotions: $witchPotions.get(),
    hunterPendingShot: $hunterPendingShot.get(),
    storyId: $selectedStoryId.get(),
  });

  return $gameSettings.get();
};

export const advancePhase = () => {
  const game = $gameSettings.get();
  const nextPhase = game.phase === "night" ? "day" : "night";
  const currentPlayers = $players.get();

  // If moving from night to day, apply the calculated results
  if (game.phase === "night" && nextPhase === "day") {
    const results = calculateNightResults(
      currentPlayers,
      $selectedTargets.get(),
      $witchPotions.get(),
    );

    // Update Witch potions if used
    if (results.witchUsedLife) $witchPotions.setKey("life", false);
    if (results.witchUsedDeath) $witchPotions.setKey("death", false);

    // Update Lovers if paired by Cupid
    if (results.cupidPair && results.cupidPair.length === 2) {
      $lovers.set(results.cupidPair);
    }

    const eliminatedIds = new Set(results.eliminatedIds);

    // Lover logic: if one dies, the other dies too
    const lovers = $lovers.get();
    if (lovers.length === 2) {
      if (lovers.some((id) => eliminatedIds.has(id))) {
        lovers.forEach((id) => eliminatedIds.add(id));
      }
    }

    // Apply eliminations
    if (eliminatedIds.size > 0) {
      const finalEliminated = Array.from(eliminatedIds);
      const nextPlayers = currentPlayers.map((p) =>
        finalEliminated.includes(p.id) ? { ...p, isAlive: false } : p,
      );

      // Hunter logic: if Hunter is in the final eliminated list, mark for shot
      const killedHunter = currentPlayers.find(
        (p) =>
          finalEliminated.includes(p.id) && p.roleId === "hunter" && p.isAlive,
      );
      if (killedHunter) {
        $hunterPendingShot.set(killedHunter.id);
      }

      $players.set(nextPlayers);
    }
  }

  $gameSettings.setKey("phase", nextPhase);
  $gameSettings.setKey("phaseStepIndex", 0);
  if (nextPhase === "night") {
    $gameSettings.setKey("cycle", game.cycle + 1);
    // Reset targets when a new night starts
    $selectedTargets.set({});
  }
};

export const resolveHunterShot = (targetId: string) => {
  $players.set(
    $players
      .get()
      .map((p) => (p.id === targetId ? { ...p, isAlive: false } : p)),
  );
  $hunterPendingShot.set(null);
};

export const setPhaseStepIndex = (index: number) => {
  $gameSettings.setKey("phaseStepIndex", index);
};

export const loadSession = async (sessionId: string) => {
  console.log("[store] loadSession called with:", sessionId);
  const session = await loadSessionFromApi(sessionId);
  console.log(
    "[store] loadSessionFromApi returned:",
    session ? "data" : "null",
  );

  if (session) {
    try {
      const data = session;
      console.log("[store] Session data:", {
        settings: data.settings,
        playersCount: data.players?.length,
        rolesCount: data.roles?.length,
      });

      // Batch updates
      $players.set(data.players || []);
      $selectedRoleIds.set(data.roles || ["villager", "werewolf"]);
      $selectedTargets.set(data.targets || {});
      $lovers.set(data.lovers || []);
      $witchPotions.set(data.witchPotions || { life: true, death: true });
      $hunterPendingShot.set(data.hunterPendingShot || null);
      $selectedStoryId.set(data.storyId || "classic");

      // Update settings last to trigger UI update
      $gameSettings.set({
        ...data.settings,
        id: sessionId, // Ensure ID matches URL
      });

      console.log(
        "[store] Session loaded successfully, new settings:",
        $gameSettings.get(),
      );
      return true;
    } catch (e) {
      console.error("Failed to parse session", e);
      return false;
    }
  }
  console.log("[store] No session data found");
  return false;
};
