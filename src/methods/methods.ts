import type { Methods } from "../types/method"
import Prayer from "./prayer/methods"


export const SkillMethods = {
	Prayer
} as const satisfies {
	[key: string]: Methods
}