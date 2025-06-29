import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan.ts";
export default {
    id: "medium",
    type: "Construction",
    label: "Medium Cost",
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
            from: 66,
            method: SkillMethods.Construction.teakGardenBenches,
        },
        {
            from: 74,
            method: SkillMethods.Construction.oakDungeonDoors,
        },
    ]
} as const satisfies Plan