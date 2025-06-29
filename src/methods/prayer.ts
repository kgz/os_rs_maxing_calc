import { Items } from "../types/items";
import type { Methods } from "../types/method";

// cspell:words bbsb bbssw dbct dbecto ectofuntus sdct unnoting

export default {
    bdbga: {
        id: "bdbga",
        label: "baby dragon bones (gilded altar)",
        xp: 105,
        items: [
            { amount: 1, item: Items.BabyDragonBones },
            { amount: 5, item: Items.Coins },
        ],
        returns: [],
        actionsPerHour: 2500,
        requirement: {
            "levels": {
                "Prayer": 15
            },
        },
    },
    dbga: {
        id: "dbga",
        label: "dragon bones (gilded altar)",
        xp: 252,
        items: [
            { amount: 1, item: Items.DragonBones },
            { amount: 5, item: Items.Coins },
        ],
        returns: [],
        actionsPerHour: 2500,
        requirement: {
            "levels": {
                "Prayer": 30
            },
        },
    },
    // New methods from the guide
    sdga: {
        id: "sdga",
        label: "superior dragon bones (gilded altar)",
        xp: 525,
        items: [
            { amount: 1, item: Items.SuperiorDragonBones },
            { amount: 5, item: Items.Coins },
        ],
        returns: [],
        actionsPerHour: 2550,
        requirement: {
            "levels": {
                "Prayer": 70
            },
        },
    },
    dbct: {
        id: "dbct",
        label: "dragon bones (chaos temple)",
        xp: 504, // 252 * 2 due to 50% chance to save bones
        items: [
            { amount: 1, item: Items.DragonBones },
            { amount: 50, item: Items.Coins }, // For unnoting at Elder Chaos druid
        ],
        returns: [],
        actionsPerHour: 2000,
        requirement: {
            "levels": {
                "Prayer": 30
            },
        },
    },
    sdct: {
        id: "sdct",
        label: "superior dragon bones (chaos temple)",
        xp: 1050, // 525 * 2 due to 50% chance to save bones
        items: [
            { amount: 1, item: Items.SuperiorDragonBones },
            { amount: 50, item: Items.Coins }, // For unnoting at Elder Chaos druid
        ],
        returns: [],
        actionsPerHour: 2000,
        requirement: {
            "levels": {
                "Prayer": 70
            },
        },
    },
    bbsb: {
        id: "bbsb",
        label: "blessed bone shards (blessed wine)",
        xp: 5,
        items: [
            { amount: 1, item: Items.BlessedBoneShards },
            { amount: 0.0025, item: Items.JugOfWine }, // 1 jug per 400 shards
        ],
        returns: [],
        actionsPerHour: 200000, // Approximately 10,000 shards per inventory, multiple inventories per hour
        requirement: {
            "levels": {
                "Prayer": 30
            },
        },
    },
    bbssw: {
        id: "bbssw",
        label: "blessed bone shards (sunfire wine)",
        xp: 6,
        items: [
            { amount: 1, item: Items.BlessedBoneShards },
            { amount: 0.0025, item: Items.JugOfWine }, // 1 jug per 400 shards
            { amount: 0.005, item: Items.SunfireSplinters }, // 2 splinters per jug
        ],
        returns: [],
        actionsPerHour: 200000,
        requirement: {
            "levels": {
                "Prayer": 30
            },
        },
    },
    dbecto: {
        id: "dbecto",
        label: "dragon bones (ectofuntus)",
        xp: 288, // 400% of base XP
        items: [
            { amount: 1, item: Items.DragonBones },
            { amount: 1, item: Items.BucketOfSlime },
        ],
        returns: [],
        actionsPerHour: 600, // Much slower method
        requirement: {
            "levels": {
                "Prayer": 30
            },
        },
    },
    ensouled: {
        id: "ensouled",
        label: "ensouled dragon heads",
        xp: 1560,
        items: [
            { amount: 1, item: Items.EnsouledDragonHead },
            { amount: 4, item: Items.SoulRune },
            { amount: 2, item: Items.BloodRune },
        ],
        returns: [],
        actionsPerHour: 180,
        requirement: {
            "levels": {
                "Prayer": 30,
                "Magic": 65
            },
        },
    },
    demonic: {
        id: "demonic",
        label: "demonic offering",
        xp: 175, // Per cast, assuming average demon ashes
        items: [
            { amount: 5, item: Items.DemonAshes },
            { amount: 2, item: Items.BloodRune },
            { amount: 2, item: Items.SoulRune },
        ],
        returns: [],
        actionsPerHour: 1200,
        requirement: {
            "levels": {
                "Prayer": 60,
                "Magic": 60
            },
        },
    }
} as const satisfies Methods