import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";
export default {
    id: "standard",
    type: "Attack",
    label: "Standard Training",
    methods: [
        {
            from: 1,
            method: SkillMethods.Attack.waterfall,
        },
        {
            from: 30,
            method: SkillMethods.Attack.sandCrabs,
        },
        {
            from: 50,
            method: SkillMethods.Attack.nmzNormal,
        },
        {
            from: 70,
            method: SkillMethods.Attack.nmzHard,
        },
    ]
} as const satisfies Plan