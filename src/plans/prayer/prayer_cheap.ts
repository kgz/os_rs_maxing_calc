import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";
export default {
    id: "cheap-cost",
    type: "Prayer",
    label: "Low Cost",
    methods: [
        {
            from: 1,
            method: SkillMethods.Prayer.bdbga,
        },
        {
            from: 30,
            method: SkillMethods.Prayer.bbsb,
        },
    ]
} as const satisfies Plan