import type { Methods } from "../types/method"
import Prayer from "./prayer/methods"
import Crafting from "./crafting/methods"
import Agility from "./agility/methods"


export const SkillMethods = {
	Prayer,
	Crafting,
	Agility
} as const satisfies {
	[key: string]: Methods
}