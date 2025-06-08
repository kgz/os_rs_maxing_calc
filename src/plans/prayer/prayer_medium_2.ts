import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";

export default {
	label: "Med High",
	id: "high-cost",
	type: "Prayer",
	methods: [
	{
        from: 30,
        method: SkillMethods.Prayer.dbga,
    },
]} as const satisfies Plan