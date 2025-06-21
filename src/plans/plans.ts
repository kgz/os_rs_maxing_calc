import type { Plan } from '../types/plan';
import type { skillsEnum } from '../types/skillsResponse';
import prayer_cheap from './prayer/prayer_cheap';
import prayer_medium from './prayer/prayer_medium';
import prayer_expensive from './prayer/prayer_expensive';
import prayer_wilderness from './prayer/prayer_wilderness';
import prayer_alternative from './prayer/prayer_alternative';
import agility_fastest from './agility/agility_fastest';
import { crafting_low_cost, crafting_medium_cost, crafting_high_cost } from './crafting';

type SkillPlans = {
	[K in keyof typeof skillsEnum]?: {
		[key:string]: Plan
	};
};

export const Plans = {
	"Agility": {
		agility_fastest
	},
	"Prayer": {
		prayer_cheap,
		prayer_medium,
		prayer_expensive,
		prayer_wilderness,
		prayer_alternative
	},
	"Crafting": {
		crafting_low_cost,
		crafting_medium_cost,
		crafting_high_cost
	}
} as const satisfies SkillPlans