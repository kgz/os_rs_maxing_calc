import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";
export default {
    id: "medium-cost",
    type: "Prayer",
    label: "Medium Cost",
    methods: [
        {
            from: 1,
            method: SkillMethods.Prayer.bdbga,
        },
        {
            from: 30,
            method: SkillMethods.Prayer.dbga,
        },
        {
            from: 70,
            method: SkillMethods.Prayer.bbssw,
        },
    ]
} as const satisfies Plan