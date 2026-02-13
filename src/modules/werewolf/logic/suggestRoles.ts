export const suggestRoles = (playerCount: number): string[] => {
  const roles: string[] = [];

  // Basic distribution logic
  // Always suggested:
  // - Werewolves (balanced quantity)
  // - Seer (almost always essential)
  // - Doctor (usually essential for games > 5)

  // Werewolf Count
  let werewolfCount = 1;
  if (playerCount >= 7) werewolfCount = 2;
  if (playerCount >= 12) werewolfCount = 3;
  if (playerCount >= 16) werewolfCount = 4;

  for (let i = 0; i < werewolfCount; i++) {
    roles.push("werewolf");
  }

  // Seer (Always for 4+)
  if (playerCount >= 4) {
    roles.push("seer");
  }

  // Doctor (6+)
  if (playerCount >= 6) {
    roles.push("doctor");
  }

  // Hunter (8+)
  if (playerCount >= 8) {
    roles.push("hunter");
  }

  // Witch (10+) - often replaces Doctor or added as strong chaos
  if (playerCount >= 10) {
    roles.push("witch");
  }

  // Cupid (12+)
  if (playerCount >= 12) {
    roles.push("cupid");
  }

  // Note: We don't explicit push 'villager' because the game engine
  // fills the rest with villagers automatically.

  return roles;
};
