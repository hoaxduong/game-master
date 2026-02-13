export type WerewolfFaction = "village" | "werewolves" | "neutral";

export interface WerewolfRole {
  id: string;
  name: string;
  faction: WerewolfFaction;
  description: string;
  nightAction?: string;
  priority: number; // For narrator order
  image?: string;
  maxTargets?: number;
  isFirstNightOnly?: boolean;
}

export const WEREWOLF_ROLES: WerewolfRole[] = [
  {
    id: "villager",
    name: "Villager",
    faction: "village",
    description:
      "A regular townsperson with no special abilities, trying to find the werewolves.",
    priority: 100,
  },
  {
    id: "werewolf",
    name: "Werewolf",
    faction: "werewolves",
    description: "Each night, the werewolves choose a player to kill.",
    nightAction: "Choose a player to eliminate.",
    priority: 10,
    maxTargets: 1,
  },
  {
    id: "seer",
    name: "Seer",
    faction: "village",
    description:
      "Each night, the Seer can check a player to see if they are a werewolf.",
    nightAction: "Check if a player is a Werewolf.",
    priority: 20,
    maxTargets: 1,
  },
  {
    id: "doctor",
    name: "Doctor",
    faction: "village",
    description:
      "Each night, the Doctor can choose one player to save from being killed.",
    nightAction: "Choose a player to protect.",
    priority: 30,
    maxTargets: 1,
  },
  {
    id: "hunter",
    name: "Hunter",
    faction: "village",
    description:
      "If the Hunter is killed (either by lynching or werewolves), they can take one person down with them.",
    priority: 40,
  },
  {
    id: "cupid",
    name: "Cupid",
    faction: "village",
    description:
      'On the first night, Cupid chooses two players to be "Lovers". If one dies, the other dies too.',
    nightAction: "Choose two players to fall in love.",
    priority: 5,
    maxTargets: 2,
    isFirstNightOnly: true,
  },
  {
    id: "witch",
    name: "Witch",
    faction: "village",
    description:
      "The Witch has two potions: one to save and one to kill. They can use each only once per game.",
    nightAction: "Decide whether to use the potion of life or death.",
    priority: 25,
    maxTargets: 1,
  },
];
