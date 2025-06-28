import type { Methods } from "../types/method"
import Prayer from "./prayer/methods"
import Crafting from "./crafting/methods"
import Agility from "./agility/methods"
import Attack from "./attack/methods"


export const SkillMethods = {
	Attack,
	Prayer,
	Crafting,
	Agility
} as const satisfies {
	[key: string]: Methods
}