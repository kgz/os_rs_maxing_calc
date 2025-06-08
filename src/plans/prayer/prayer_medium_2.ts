import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";

export default {
	label: "Med High",
	methods: [
	{
        from: 30,
        method: SkillMethods.Prayer.dbga,
    },
]} as const satisfies Plan