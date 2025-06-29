import type { Methods } from "../types/method"
import Prayer from "./prayer"
import Crafting from "./crafting"
import Agility from "./agility"
import Attack from "./attack"
import Cooking from "./cooking"


export const SkillMethods = {
	Attack,
	Prayer,
	Crafting,
	Cooking,
	Agility
} as const satisfies {
	[key: string]: Methods
}