import { atom, map, onMount } from "nanostores";
import type { WerewolfRole } from "../types/roles";

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
}

// Stores
export const $gameSettings = map<GameSettings>({
  id: crypto.randomUUID(),
  status: "setup",
  phase: "night",
  cycle: 0,
});

// Persistence keys
const STORAGE_PREFIX = "werewolf_session_";

// Persistence setup
onMount($gameSettings, () => {
  const save = () => {
    localStorage.setItem(
      `${STORAGE_PREFIX}${$gameSettings.get().id}`,
      JSON.stringify({
        settings: $gameSettings.get(),
        players: $players.get(),
        roles: $selectedRoleIds.get(),
      }),
    );
  };

  const unsubscribeSettings = $gameSettings.listen(save);
  const unsubscribePlayers = $players.listen(save);
  const unsubscribeRoles = $selectedRoleIds.listen(save);

  return () => {
    unsubscribeSettings();
    unsubscribePlayers();
    unsubscribeRoles();
  };
});

export const $players = atom<Player[]>([]);
export const $selectedRoleIds = atom<string[]>(["villager", "werewolf"]); // Default roles

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

export const startGame = () => {
  const players = [...$players.get()];
  const roles = [...$selectedRoleIds.get()];

  if (players.length < roles.length) {
    throw new Error("More roles than players!");
  }

  // Basic role distribution (padding with villagers if needed)
  let rolesToAssign = [...roles];
  while (rolesToAssign.length < players.length) {
    rolesToAssign.push("villager");
  }

  // Shuffle
  for (let i = rolesToAssign.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rolesToAssign[i], rolesToAssign[j]] = [rolesToAssign[j], rolesToAssign[i]];
  }

  // Assign
  const updatedPlayers = players.map((p, i) => ({
    ...p,
    roleId: rolesToAssign[i],
  }));

  $players.set(updatedPlayers);
  $gameSettings.setKey("status", "playing");
};

export const resetGame = () => {
  $gameSettings.set({
    id: crypto.randomUUID(),
    status: "setup",
    phase: "night",
    cycle: 0,
  });
  $players.set([]);
  // Keep roles as they are or reset to default?
  // User asked to "allow create new game", usually implies fresh start.
};

export const loadSession = (id: string) => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
  if (data) {
    const parsed = JSON.parse(data);
    $gameSettings.set(parsed.settings);
    $players.set(parsed.players);
    $selectedRoleIds.set(parsed.roles);
    return true;
  }
  return false;
};
