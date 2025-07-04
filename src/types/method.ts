import type { Modifiers } from "../modifiers";
import type { Item } from "./items";
import { skillsEnum } from "./skillsResponse";


type SkillLevels = {
	[K in keyof typeof skillsEnum]?: number;
};

type Mods = keyof typeof Modifiers

export type AllowedModifiers = keyof typeof Modifiers[Mods]; 


export type Method = {
	id: string;
	label: string;
	xp: number;
	items: { amount: number | ((fromLevel: number, toLevel:number, modifiers?: string[]) => number), item: Item, link?: string }[];
	returns: { amount: number | ((fromLevel: number, toLevel:number, modifiers?: string[]) => number), item: Item, link?: string }[];
	// perhaps we add a lower and upper bound on the number of actions
	actionsPerHour: number;
	requirement: {
		levels: SkillLevels;
		other?: unknown;
	},
	allowed_modifiers?:  AllowedModifiers[];
}

export type Methods = {
	[key: string]: Method;
}