import { SkillMethods } from "../../methods/index.ts";
import type { Plan } from "../../types/plan";

export default {
    id: "high-cost",
    type: "Crafting",
    label: "High Cost (Fast XP)",
    methods: [
        {
            from: 1,
            method: SkillMethods.Crafting.leatherGloves,
        },
        {
            from: 7,
            method: SkillMethods.Crafting.leatherBoots,
        },
        {
            from: 9,
            method: SkillMethods.Crafting.leatherCowl,
        },
        {
            from: 11,
            method: SkillMethods.Crafting.leatherVambraces,
        },
        {
            from: 14,
            method: SkillMethods.Crafting.leatherBody,
        },
        {
            from: 20,
            method: SkillMethods.Crafting.cutSapphire,
        },
        {
            from: 27,
            method: SkillMethods.Crafting.cutEmerald,
        },
        {
            from: 34,
            method: SkillMethods.Crafting.cutRuby,
        },
        {
            from: 43,
            method: SkillMethods.Crafting.cutDiamond,
        },
        {
            from: 63,
            method: SkillMethods.Crafting.greenDhideBody,
        },
        {
            from: 71,
            method: SkillMethods.Crafting.blueDhideBody,
        },
        {
            from: 77,
            method: SkillMethods.Crafting.redDhideBody,
        },
        {
            from: 84,
            method: SkillMethods.Crafting.blackDhideBody,
        }
    ]
} as const satisfies Plan