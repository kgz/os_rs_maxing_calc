import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";
export default {
    id: "wilderness",
    type: "Prayer",
    label: "Wilderness (Risky)",
    methods: [
        {
            from: 1,
            method: SkillMethods.Prayer.bdbga,
        },
        {
            from: 30,
            method: SkillMethods.Prayer.dbct,
        },
        {
            from: 70,
            method: SkillMethods.Prayer.sdct,
        },
    ]
} as const satisfies Plan