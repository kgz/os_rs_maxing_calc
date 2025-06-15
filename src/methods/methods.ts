import type { Methods } from "../types/method"
import Prayer from "./prayer/methods"
import Crafting from "./crafting/methods"


export const SkillMethods = {
	Prayer,
	Crafting
} as const satisfies {
	[key: string]: Methods
}