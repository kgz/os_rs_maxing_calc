import type { Methods } from "../types/method"
import Prayer from "./prayer/methods"
import Crafting from "./crafting/methods"
import Agility from "./agility/methods"
import Attack from "./attack/methods"
import Cooking from "./cooking/methods"


export const SkillMethods = {
	Attack,
	Prayer,
	Crafting,
	Cooking,
	Agility
} as const satisfies {
	[key: string]: Methods
}