import type { Item } from "./items";
import { skillsEnum } from "./skillsResponse";


type SkillLevels = {
	[K in keyof typeof skillsEnum]?: number;
};

export type Method = {
	id: string;
	label: string;
	xp: number;
	items: { amount: number, item: Item }[];
	returns: Item[];
	// pehaps we add a lower and upper bound on the number of actions
	actionsPerHour: number;
	requirments: {
		levels: SkillLevels;
		other?: unknown;
	}
}

export type Methods = {
	[key: string]: Method;
}