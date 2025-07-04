import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";

export default {
    id: "fastest",
    type: "Agility",
    label: "Fastest",
    methods: [
        {
            from: 20,
            method: SkillMethods.Agility.brimhavenArena,
        },
        {
            from: 47,
            method: SkillMethods.Agility.wildernessAgilityCourse,
        },
        {
            from: 62,
            method: SkillMethods.Agility.hallowedSepulchre,
        },
       
    ]
} as const satisfies Plan