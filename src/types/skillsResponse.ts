
export const skillsEnum = {
    // Overall: 'overall',
    Attack: 'attack',
    Defence: 'defence',
    Strength: 'strength',
    Hitpoints: 'hitpoints',
    Ranged: 'ranged',
    Prayer: 'prayer',
    Magic: 'magic',
    Cooking: 'cooking',
    Woodcutting: 'woodcutting',
    Fletching: 'fletching',
    Fishing: 'fishing',
    Firemaking: 'firemaking',
    Crafting: 'crafting',
    Smithing: 'smithing',
    Mining: 'mining',
    Herblore: 'herblore',
    Agility: 'agility',
    Thieving: 'thieving',
    Slayer: 'slayer',
    Farming: 'farming',
    Runecraft: 'runecrafting',
    Hunter: 'hunter',
    Construction: 'construction',
} as const;

// Create a type from the object values
export type SkillName = keyof typeof skillsEnum;

export interface SkillsResponse {
    skills: Skill[];
    activities: Activity[];
}

export interface Activity {
    id: number;
    name: string;
    rank: number;
    score: number;
}

export interface Skill {
    id: number;
    name: SkillName;
    rank: number;
    level: number;
    xp: number;
}
