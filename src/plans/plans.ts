import type { Plan } from '../types/plan';
import type { skillsEnum } from '../types/skillsResponse';
import prayer_medium_1 from './prayer/prayer_medium_1';
import prayer_medium_2 from './prayer/prayer_medium_2';
import { crafting_low_cost, crafting_medium_cost, crafting_high_cost } from './crafting';

type SkillPlans = {
	[K in keyof typeof skillsEnum]?: {
		[key:string]: Plan
	};
};

export const Plans = {
	"Prayer": {
		prayer_medium_1,
		prayer_medium_2
	},
	"Crafting": {
		crafting_low_cost,
		crafting_medium_cost,
		crafting_high_cost
	}
} as const satisfies SkillPlans