import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";
export default {
    id: "fast",
    type: "Cooking",
    label: "Fast XP",
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
            from: 30,
            method: SkillMethods.Cooking.karambwan,
        },
        {
            from: 40,
            method: SkillMethods.Cooking.lobster,
        },
        {
            from: 45,
            method: SkillMethods.Cooking.swordfish,
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