import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";
export default {
    id: "high-cost",
    type: "Prayer",
    label: "High Cost",
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
            method: SkillMethods.Prayer.sdga,
        },
    ]
} as const satisfies Plan