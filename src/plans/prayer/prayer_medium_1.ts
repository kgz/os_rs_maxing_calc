import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";

export default {
	id: "med-cost",
	type: "Prayer",
	label: "Med Cost",
	methods: [
	{
		from: 1,
		method: SkillMethods.Prayer.bdbga,
	},
	{
        from: 95,
        method: SkillMethods.Prayer.dbga,
    },
]} as const satisfies Plan