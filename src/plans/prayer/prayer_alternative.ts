import { SkillMethods } from "../../methods/methods";
export default {
    id: "alternative",
    type: "Prayer",
    label: "Alternative",
    methods: [
        {
            from: 1,
            method: SkillMethods.Prayer.bdbga,
        },
        {
            from: 30,
            method: SkillMethods.Prayer.dbecto,
        },
        {
            from: 60,
            method: SkillMethods.Prayer.demonic,
        },
        {
            from: 65,
            method: SkillMethods.Prayer.ensouled,
        },
    ]
} as const satisfies Plan