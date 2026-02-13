export interface StoryVibe {
  id: string;
  icon: string;
  name: string;
  villageName: string;
  description: string;
  narratorIntro: string;
  nightText: string;
  dayText: string;
}

export const STORY_VIBES: StoryVibe[] = [
  {
    id: "classic",
    icon: "🏰",
    name: "Classic",
    villageName: "Ravenhollow",
    description:
      "The traditional werewolf experience in a quiet, cursed village.",
    narratorIntro: "narrator.intro.classic",
    nightText: "narrator.night.classic",
    dayText: "narrator.day.classic",
  },
  {
    id: "medieval",
    icon: "⚔️",
    name: "Medieval",
    villageName: "Ironkeep",
    description: "A dark age of knights and castles where beasts roam.",
    narratorIntro: "narrator.intro.medieval",
    nightText: "narrator.night.medieval",
    dayText: "narrator.day.medieval",
  },
  {
    id: "haunted",
    icon: "👻",
    name: "Haunted",
    villageName: "Hollowshade",
    description:
      "An abandoned ghost town where spirits are not the only threat.",
    narratorIntro: "narrator.intro.haunted",
    nightText: "narrator.night.haunted",
    dayText: "narrator.day.haunted",
  },
  {
    id: "pirate",
    icon: "🏴‍☠️",
    name: "Pirate",
    villageName: "Blacktide Bay",
    description:
      "A misty cove where smugglers hide and something darker lurks.",
    narratorIntro: "narrator.intro.pirate",
    nightText: "narrator.night.pirate",
    dayText: "narrator.day.pirate",
  },
  {
    id: "folklore",
    icon: "🎋",
    name: "Vn Folklore",
    villageName: "Làng Trăng Khuyết",
    description:
      "A mythical Vietnamese village under the light of a blood moon.",
    narratorIntro: "narrator.intro.folklore",
    nightText: "narrator.night.folklore",
    dayText: "narrator.day.folklore",
  },
];
