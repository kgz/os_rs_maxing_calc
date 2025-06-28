import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";
export default {
    id: "profit",
    type: "Cooking",
    label: "Profit",
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
            from: 62,
            method: SkillMethods.Cooking.monkfish,
        },
        {
            from: 80,
            method: SkillMethods.Cooking.shark,
        },
        {
            from: 84,
            method: SkillMethods.Cooking.anglerfish,
        },
        {
            from: 90,
            method: SkillMethods.Cooking.darkCrab,
        },
    ]
} as const satisfies Plan;