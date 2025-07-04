import { skillsEnum } from "../types/skillsResponse";
import { cookingModifiers } from "./cooking";

export type TModifiers = {
	[key:string]: {
		image?: string;
		label?: string;
		stats?: string
	};
}

export const Modifiers = {
	"Cooking": cookingModifiers
} as const satisfies {
	[key in keyof Partial<typeof skillsEnum>]: TModifiers
};