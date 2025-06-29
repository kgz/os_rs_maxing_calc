import type { Methods } from "../types/method"
import Prayer from "./prayer"
import Crafting from "./crafting"
import Agility from "./agility"
import Attack from "./attack"
import Cooking from "./cooking"
import Construction from "./construction"


export const SkillMethods = {
	Attack,
	Prayer,
	Crafting,
	Cooking,
	Construction,
	Agility
} as const satisfies {
	[key: string]: Methods
}