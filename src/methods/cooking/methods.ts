import { Items } from "../../types/items";
import type { Methods } from "../../types/method";

// Helper function to calculate success rate based on level
const getCookSuccessRate = (currentLevel: number, baseLevel: number, maxLevel: number, minRate: number = 0.6, maxRate: number = 1.0) => {
  if (currentLevel >= maxLevel) return maxRate;
  if (currentLevel <= baseLevel) return minRate;
  
  // Linear interpolation between min and max rates
  const levelRange = maxLevel - baseLevel;
  const levelProgress = currentLevel - baseLevel;
  return minRate + (maxRate - minRate) * (levelProgress / levelRange);
};

export default {
    shrimpAnchovies: {
        id: "shrimpAnchovies",
        label: "Shrimp & Anchovies",
        xp: 30, // Average XP per cook
        items: [
            { amount: 1, item: Items.RawShrimps },
        ],
        returns: [
            { amount: 0.7, item: Items.Shrimps }, // Accounting for burn rate
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {},
        },
    },
    trout: {
        id: "trout",
        label: "Trout",
        xp: 70,
        items: [
            { amount: 1, item: Items.RawTrout },
        ],
        returns: [
            { amount: 1, item: Items.Trout },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 15
            },
        },
    },
    salmon: {
        id: "salmon",
        label: "Salmon",
        xp: 90,
        items: [
            { amount: 1, item: Items.RawSalmon },
        ],
        returns: [
            { amount: 0.8, item: Items.Salmon },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 25
            },
        },
    },
    karambwan: {
        id: "karambwan",
        label: "Karambwan",
        xp: 190,
        items: [
            { amount: 1, item: Items.RawKarambwan },
        ],
        returns: [
            { amount: 0.9, item: Items.CookedKarambwan },
        ],
        actionsPerHour: 1500,
        requirments: {
            "levels": {
                "Cooking": 30
            },
        },
    },
    lobster: {
        id: "lobster",
        label: "Lobster",
        xp: 120,
        items: [
            { 
                amount: (fromLevel: number, toLevel: number) => {
                    // Calculate average success rate across the level range
                    let totalRate = 0;
                    let levels = 0;
                    
                    for (let level = fromLevel; level <= toLevel; level++) {
                        totalRate += getCookSuccessRate(level, 40, 74, 0.6, 1.0);
                        levels++;
                    }
                    
                    const avgSuccessRate = levels > 0 ? totalRate / levels : getCookSuccessRate(fromLevel, 40, 74, 0.6, 1.0);
                    // Return the number of raw items needed per cooked item (inverse of success rate)
                    return 1 / avgSuccessRate;
                },
                item: Items.RawLobster 
            },
        ],
        returns: [
            { amount: 1, item: Items.Lobster },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 40
            },
        },
    },
    swordfish: {
        id: "swordfish",
        label: "Swordfish",
        xp: 140,
        items: [
            { amount: 1, item: Items.RawSwordfish },
        ],
        returns: [
            { amount: 0.85, item: Items.Swordfish },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 45
            },
        },
    },
    monkfish: {
        id: "monkfish",
        label: "Monkfish",
        xp: 150,
        items: [
            { amount: 1, item: Items.RawMonkfish },
        ],
        returns: [
            { amount: 0.9, item: Items.Monkfish },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 62
            },
        },
    },
    shark: {
        id: "shark",
        label: "Shark",
        xp: 210,
        items: [
            { amount: 1, item: Items.RawShark },
        ],
        returns: [
            { amount: 0.85, item: Items.SharkCooked },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 80
            },
        },
    },
    anglerfish: {
        id: "anglerfish",
        label: "Anglerfish",
        xp: 230,
        items: [
            { amount: 1, item: Items.RawAnglerfish },
        ],
        returns: [
            { amount: 0.85, item: Items.Anglerfish },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 84
            },
        },
    },
    darkCrab: {
        id: "darkCrab",
        label: "Dark Crab",
        xp: 215,
        items: [
            { amount: 1, item: Items.RawDarkCrab },
        ],
        returns: [
            { amount: 0.9, item: Items.DarkCrab },
        ],
        actionsPerHour: 1300,
        requirments: {
            "levels": {
                "Cooking": 90
            },
        },
    },
    wine: {
        id: "wine",
        label: "Wine",
        xp: 200,
        items: [
            { amount: 1, item: Items.Grapes },
            { amount: 1, item: Items.JugOfWater },
        ],
        returns: [
            { amount: 1, item: Items.JugOfWine },
        ],
        actionsPerHour: 1500,
        requirments: {
            "levels": {
                "Cooking": 65
            },
        },
    }
} as const satisfies Methods