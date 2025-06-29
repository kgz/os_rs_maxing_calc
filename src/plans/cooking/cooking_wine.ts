import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";
export default {
    id: "wine",
    type: "Cooking",
    label: "Wine",
    methods: [
        {
            from: 1,
            method: SkillMethods.Cooking.shrimpAnchovies,
        },
        {
            from: 15,
            method: SkillMethods.Cooking.trout,
        },
        {
            from: 25,
            method: SkillMethods.Cooking.salmon,
        },
        {
            from: 40,
            method: SkillMethods.Cooking.lobster,
        },
        {
            from: 65,
            method: SkillMethods.Cooking.wine,
        },
    ]
} as const satisfies Plan;