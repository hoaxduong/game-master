import type { Player } from "./store";
import { WEREWOLF_ROLES } from "../types/roles";

export interface NightResult {
  eliminatedIds: string[];
  savedIds: string[];
  checkedResults: Record<string, string>; // playerId -> roleName
  cupidPair?: string[];
  witchUsedLife?: boolean;
  witchUsedDeath?: boolean;
}

export function calculateNightResults(
  players: Player[],
  selectedTargets: Record<string, string[]>,
  witchPotions?: { life: boolean; death: boolean },
): NightResult {
  const eliminatedIdsSet = new Set<string>();
  const savedIdsSet = new Set<string>();
  const checkedResults: Record<string, string> = {};
  let cupidPair: string[] | undefined = undefined;
  let witchUsedLife = false;
  let witchUsedDeath = false;

  // 1. Cupid (only if not already paired, usually handled by step existence)
  const cupidTargets = selectedTargets["night-cupid"] || [];
  if (cupidTargets.length === 2) {
    cupidPair = cupidTargets;
  }

  // 2. Werewolves kill
  const werewolfTargets = selectedTargets["night-werewolf"] || [];
  werewolfTargets.forEach((id) => eliminatedIdsSet.add(id));

  // 3. Doctor saves
  const doctorTargets = selectedTargets["night-doctor"] || [];
  doctorTargets.forEach((id) => savedIdsSet.add(id));

  // 4. Witch logic (split into save and kill)
  if (witchPotions?.life) {
    const witchSaveTargets = selectedTargets["night-witch-save"] || [];
    if (witchSaveTargets.length > 0) {
      witchSaveTargets.forEach((id) => savedIdsSet.add(id));
      witchUsedLife = true;
    }
  }

  if (witchPotions?.death) {
    const witchKillTargets = selectedTargets["night-witch-kill"] || [];
    if (witchKillTargets.length > 0) {
      witchKillTargets.forEach((id) => eliminatedIdsSet.add(id));
      witchUsedDeath = true;
    }
  }

  // 5. Seer checks
  const seerTargets = selectedTargets["night-seer"] || [];
  seerTargets.forEach((id) => {
    const targetPlayer = players.find((p) => p.id === id);
    if (targetPlayer?.roleId) {
      checkedResults[id] = targetPlayer.roleId;
    }
  });

  // Final elimination list: marked for death AND not saved
  const finalEliminated = Array.from(eliminatedIdsSet).filter(
    (id) => !savedIdsSet.has(id),
  );

  return {
    eliminatedIds: finalEliminated,
    savedIds: Array.from(savedIdsSet),
    checkedResults,
    cupidPair,
    witchUsedLife,
    witchUsedDeath,
  };
}
