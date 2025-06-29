import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan.ts";
export default {
    id: "fastest",
    type: "Construction",
    label: "Fastest XP",
    methods: [
        {
            from: 1,
            method: SkillMethods.Construction.daddysHome,
        },
        {
            from: 8,
            method: SkillMethods.Construction.baggedPlants,
        },
        {
            from: 33,
            method: SkillMethods.Construction.oakLarders,
        },
        {
            from: 52,
            method: SkillMethods.Construction.mahoganyTables,
        },
    ]
} as const satisfies Plan