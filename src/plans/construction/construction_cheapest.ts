import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan.ts";
export default {
    id: "cheapest",
    type: "Construction",
    label: "Cheapest",
    methods: [
        {
            from: 1,
            method: SkillMethods.Construction.daddysHome,
        },
        {
            from: 8,
            method: SkillMethods.Construction.mahoganyHomes,
        },
        {
            from: 50,
            method: SkillMethods.Construction.mountedMythicalCapes,
        },
        {
            from: 74,
            method: SkillMethods.Construction.oakDungeonDoors,
        },
    ]
} as const satisfies Plan