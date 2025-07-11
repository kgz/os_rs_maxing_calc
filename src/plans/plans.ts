import type { Plan } from '../types/plan';
import type { skillsEnum } from '../types/skillsResponse';
import prayer_cheap from './prayer/prayer_cheap';
import prayer_medium from './prayer/prayer_medium';
import prayer_expensive from './prayer/prayer_expensive';
import prayer_wilderness from './prayer/prayer_wilderness';
import prayer_alternative from './prayer/prayer_alternative';
import agility_fastest from './agility/agility_fastest';

import { crafting_low_cost, crafting_medium_cost, crafting_high_cost } from './crafting';
import attack_training from './attack/attack_training';
import cooking_fast from './cooking/cooking_fast';
import cooking_profit from './cooking/cooking_profit';
import cooking_wine from './cooking/cooking_wine';
import { construction_cheapest, construction_medium, construction_fastest } from './construction';
import { test_method } from './farming';

export type SkillPlans = {
	[K in keyof typeof skillsEnum]?: {
		[key:string]: Plan
	};
};

export const Plans = {
	"Attack": {
		// Add attack plans here
		attack_training
    },
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
	},
	Cooking: {
		cooking_fast,
		cooking_profit,
		cooking_wine
	},
	"Construction": {
		construction_cheapest,
		construction_medium,
		construction_fastest
	},
	Farming: {
		test_method
	 } // Add farming plans here
} as const satisfies SkillPlans