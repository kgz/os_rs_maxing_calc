import { SkillMethods } from "../../methods/methods";
import type { Plan } from "../../types/plan";

export default {
    id: "med-cost",
    type: "Crafting",
    label: "Medium Cost",
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
            from: 54,
            method: SkillMethods.Crafting.waterBattlestaff,
        },
        {
            from: 58,
            method: SkillMethods.Crafting.earthBattlestaff,
        },
        {
            from: 62,
            method: SkillMethods.Crafting.fireBattlestaff,
        }
    ]
} as const satisfies Plan