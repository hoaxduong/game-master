import type { Player } from "./store";
import { WEREWOLF_ROLES } from "../types/roles";
import { werewolf } from "../i18n";

export type PhaseStepType =
  | "mapping"
  | "announcement"
  | "role_action"
  | "discussion"
  | "vote";

export interface PhaseStep {
  id: string;
  roleId?: string;
  type: PhaseStepType;
  titleKey: string;
  descriptionKey: string;
  playerIds: string[]; // players involved in this step
  targetCount?: number; // expected number of players for this step (e.g. mapping)
  maxTargets?: number; // max targets allowed for action
  isDeadRole?: boolean; // true if the role's player(s) are dead — step is still shown to prevent meta-gaming
}

type Lang = "en" | "vi";

/**
 * Build night phase steps based on alive players and their roles.
 * Steps are sorted by role priority (lower = earlier).
 */
export function getNightSteps(
  players: Player[],
  cycle: number,
  selectedRoleIds: string[],
  lang: Lang,
  witchPotions?: { life: boolean; death: boolean },
): PhaseStep[] {
  const steps: PhaseStep[] = [];

  // 1. Role Mapping Ritual (Night 1 only)
  if (cycle === 1) {
    const uniqueRolesInPool = Array.from(new Set(selectedRoleIds));
    const sortedPoolRoles = WEREWOLF_ROLES.filter(
      (r) => uniqueRolesInPool.includes(r.id) && r.id !== "villager",
    ).sort((a, b) => a.priority - b.priority);

    for (const role of sortedPoolRoles) {
      const targetCount = selectedRoleIds.filter((id) => id === role.id).length;
      steps.push({
        id: `night-mapping-${role.id}`,
        roleId: role.id,
        type: "mapping",
        titleKey: "phase.night.mapping.role",
        descriptionKey: "phase.night.mapping.desc",
        playerIds: players.map((p) => p.id),
        targetCount,
      });
    }
  }

  // 2. Opening: everyone sleeps
  steps.push({
    id: "night-sleep",
    type: "announcement",
    titleKey: "phase.night.sleep",
    descriptionKey: "phase.night.sleep.desc",
    playerIds: [],
  });

  // 3. Collect night-active roles from ALL players (alive or dead) to prevent meta-gaming
  const rolePlayerMap = new Map<string, Player[]>();
  const deadRoleIds = new Set<string>();
  for (const player of players) {
    if (!player.roleId) continue;
    const role = WEREWOLF_ROLES.find((r) => r.id === player.roleId);
    if (!role?.nightAction) continue;

    // Cupid only wakes on night 1
    if (role.id === "cupid" && cycle !== 1) continue;

    if (!player.isAlive) {
      deadRoleIds.add(role.id);
      // Still register the role so it appears in sortedRoles
      if (!rolePlayerMap.has(role.id)) {
        rolePlayerMap.set(role.id, []);
      }
      continue;
    }

    const existing = rolePlayerMap.get(role.id) || [];
    existing.push(player);
    rolePlayerMap.set(role.id, existing);
  }

  // Sort roles by priority
  const sortedRoles = WEREWOLF_ROLES.filter(
    (r) => r.nightAction && rolePlayerMap.has(r.id),
  ).sort((a, b) => a.priority - b.priority);

  // 4. One step per role (Active actions)
  for (const role of sortedRoles) {
    const rolePlayers = rolePlayerMap.get(role.id) || [];
    const allDead = rolePlayers.length === 0 && deadRoleIds.has(role.id);

    if (role.id === "witch") {
      if (allDead) {
        // Witch is dead — add a single dummy step
        steps.push({
          id: `night-witch-save`,
          roleId: role.id,
          type: "role_action",
          titleKey: "phase.night.roleWake",
          descriptionKey: `role.witch.nightAction.save`,
          playerIds: [],
          maxTargets: 1,
          isDeadRole: true,
        });
      } else {
        // Witch specific: split into two steps if potions available
        if (witchPotions?.life) {
          steps.push({
            id: `night-witch-save`,
            roleId: role.id,
            type: "role_action",
            titleKey: "phase.night.roleWake",
            descriptionKey: `role.witch.nightAction.save`,
            playerIds: rolePlayers.map((p) => p.id),
            maxTargets: 1,
          });
        }
        if (witchPotions?.death) {
          steps.push({
            id: `night-witch-kill`,
            roleId: role.id,
            type: "role_action",
            titleKey: "phase.night.roleWake",
            descriptionKey: `role.witch.nightAction.kill`,
            playerIds: rolePlayers.map((p) => p.id),
            maxTargets: 1,
          });
        }
      }
    } else {
      steps.push({
        id: `night-${role.id}`,
        roleId: role.id,
        type: "role_action",
        titleKey: "phase.night.roleWake",
        descriptionKey: `role.${role.id}.nightAction`,
        playerIds: allDead ? [] : rolePlayers.map((p) => p.id),
        maxTargets: role.maxTargets,
        ...(allDead && { isDeadRole: true }),
      });
    }
  }

  // 5. Closing: everyone wakes up
  steps.push({
    id: "night-wake",
    type: "announcement",
    titleKey: "phase.night.wake",
    descriptionKey: "phase.night.wake.desc",
    playerIds: [],
  });

  return steps;
}

/**
 * Build day phase steps (fixed structure).
 */
export function getDaySteps(
  _lang: Lang,
  hunterPendingShot: string | null,
): PhaseStep[] {
  const steps: PhaseStep[] = [
    {
      id: "day-announce",
      type: "announcement",
      titleKey: "phase.day.announce",
      descriptionKey: "phase.day.announce.desc",
      playerIds: [],
    },
  ];

  // If Hunter died, they get a special step to shoot someone
  if (hunterPendingShot) {
    steps.push({
      id: "day-hunter-shot",
      roleId: "hunter",
      type: "role_action",
      titleKey: "phase.day.hunterShot",
      descriptionKey: "role.hunter.deathShot",
      playerIds: [hunterPendingShot],
      maxTargets: 1,
    });
  }

  steps.push(
    {
      id: "day-discuss",
      type: "discussion",
      titleKey: "phase.day.discuss",
      descriptionKey: "phase.day.discuss.desc",
      playerIds: [],
    },
    {
      id: "day-vote",
      type: "vote",
      titleKey: "phase.day.vote",
      descriptionKey: "phase.day.vote.desc",
      playerIds: [],
    },
    {
      id: "day-result",
      type: "announcement",
      titleKey: "phase.day.result",
      descriptionKey: "phase.day.result.desc",
      playerIds: [],
    },
  );

  return steps;
}
