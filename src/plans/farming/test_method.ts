import { SkillMethods } from "../../methods";
import type { Plan } from "../../types/plan";

export default {
	id: "test",
	type: "Farming",
	label: "High Cost (Fast XP)",
	methods: [
		{
			from: 1,
			method: SkillMethods.Farming.potatoSeeds,
		}
	]
} as const satisfies Plan