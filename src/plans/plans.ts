import type { Plan } from '../types/plan';
import type { skillsEnum } from '../types/skillsResponse';
import prayer_medium_1 from './prayer/prayer_medium_1';
import prayer_medium_2 from './prayer/prayer_medium_2';

type SkillPlans = {
	[K in keyof typeof skillsEnum]?: {
		[key:string]: Plan
	};
};

export const Plans = {
	"Prayer": {
		prayer_medium_1,
		prayer_medium_2
	}
}as const satisfies SkillPlans