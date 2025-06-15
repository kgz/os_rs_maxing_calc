import { Items } from "../../types/items";
import type { Methods } from "../../types/method";

export default {
  leatherGloves: {
    id: "leatherGloves",
    label: "leather gloves",
    xp: 13.8,
    items: [
      { amount: 1, item: Items.Leather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.LeatherGloves }
    ],
    actionsPerHour: 1000,
    requirments: {
      "levels": {
        "Crafting": 1
      },
    },
  },
  leatherBoots: {
    id: "leatherBoots",
    label: "leather boots",
    xp: 16.2,
    items: [
      { amount: 1, item: Items.Leather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.LeatherBoots }
    ],
    actionsPerHour: 1000,
    requirments: {
      "levels": {
        "Crafting": 7
      },
    },
  },
  leatherCowl: {
    id: "leatherCowl",
    label: "leather cowl",
    xp: 18.5,
    items: [
      { amount: 1, item: Items.Leather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.LeatherCowl }
    ],
    actionsPerHour: 1000,
    requirments: {
      "levels": {
        "Crafting": 9
      },
    },
  },
  leatherVambraces: {
    id: "leatherVambraces",
    label: "leather vambraces",
    xp: 22,
    items: [
      { amount: 1, item: Items.Leather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.LeatherVambraces }
    ],
    actionsPerHour: 1000,
    requirments: {
      "levels": {
        "Crafting": 11
      },
    },
  },
  leatherBody: {
    id: "leatherBody",
    label: "leather body",
    xp: 25,
    items: [
      { amount: 1, item: Items.Leather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.LeatherBody }
    ],
    actionsPerHour: 1000,
    requirments: {
      "levels": {
        "Crafting": 14
      },
    },
  },
  cutSapphire: {
    id: "cutSapphire",
    label: "cut sapphire",
    xp: 50,
    items: [
      { amount: 1, item: Items.UncutSapphire },
      { amount: 1, item: Items.Chisel },
    ],
    returns: [
      { amount: 1, item: Items.Sapphire }
    ],
    actionsPerHour: 2780,
    requirments: {
      "levels": {
        "Crafting": 20
      },
    },
  },
  cutEmerald: {
    id: "cutEmerald",
    label: "cut emerald",
    xp: 67.5,
    items: [
      { amount: 1, item: Items.UncutEmerald },
      { amount: 1, item: Items.Chisel },
    ],
    returns: [
      { amount: 1, item: Items.Emerald }
    ],
    actionsPerHour: 2780,
    requirments: {
      "levels": {
        "Crafting": 27
      },
    },
  },
  cutRuby: {
    id: "cutRuby",
    label: "cut ruby",
    xp: 85,
    items: [
      { amount: 1, item: Items.UncutRuby },
      { amount: 1, item: Items.Chisel },
    ],
    returns: [
      { amount: 1, item: Items.Ruby }
    ],
    actionsPerHour: 2780,
    requirments: {
      "levels": {
        "Crafting": 34
      },
    },
  },
  cutDiamond: {
    id: "cutDiamond",
    label: "cut diamond",
    xp: 107.5,
    items: [
      { amount: 1, item: Items.UncutDiamond },
      { amount: 1, item: Items.Chisel },
    ],
    returns: [
      { amount: 1, item: Items.Diamond }
    ],
    actionsPerHour: 2780,
    requirments: {
      "levels": {
        "Crafting": 43
      },
    },
  },
  waterBattlestaff: {
    id: "waterBattlestaff",
    label: "water battlestaff",
    xp: 100,
    items: [
      { amount: 1, item: Items.Battlestaff },
      { amount: 1, item: Items.WaterOrb },
    ],
    returns: [
      { amount: 1, item: Items.WaterBattlestaff }
    ],
    actionsPerHour: 2800,
    requirments: {
      "levels": {
        "Crafting": 54
      },
    },
  },
  earthBattlestaff: {
    id: "earthBattlestaff",
    label: "earth battlestaff",
    xp: 112.5,
    items: [
      { amount: 1, item: Items.Battlestaff },
      { amount: 1, item: Items.EarthOrb },
    ],
    returns: [
      { amount: 1, item: Items.EarthBattlestaff }
    ],
    actionsPerHour: 2800,
    requirments: {
      "levels": {
        "Crafting": 58
      },
    },
  },
  fireBattlestaff: {
    id: "fireBattlestaff",
    label: "fire battlestaff",
    xp: 125,
    items: [
      { amount: 1, item: Items.Battlestaff },
      { amount: 1, item: Items.FireOrb },
    ],
    returns: [
      { amount: 1, item: Items.FireBattlestaff }
    ],
    actionsPerHour: 2800,
    requirments: {
      "levels": {
        "Crafting": 62
      },
    },
  },
  greenDhideBody: {
    id: "greenDhideBody",
    label: "green d'hide body",
    xp: 186,
    items: [
      { amount: 3, item: Items.GreenDragonLeather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.GreenDhideBody }
    ],
    actionsPerHour: 1750,
    requirments: {
      "levels": {
        "Crafting": 63
      },
    },
  },
  blueDhideBody: {
    id: "blueDhideBody",
    label: "blue d'hide body",
    xp: 210,
    items: [
      { amount: 3, item: Items.BlueDragonLeather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.BlueDhideBody }
    ],
    actionsPerHour: 1750,
    requirments: {
      "levels": {
        "Crafting": 71
      },
    },
  },
  redDhideBody: {
    id: "redDhideBody",
    label: "red d'hide body",
    xp: 234,
    items: [
      { amount: 3, item: Items.RedDragonLeather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.RedDhideBody }
    ],
    actionsPerHour: 1750,
    requirments: {
      "levels": {
        "Crafting": 77
      },
    },
  },
  blackDhideBody: {
    id: "blackDhideBody",
    label: "black d'hide body",
    xp: 258,
    items: [
      { amount: 3, item: Items.BlackDragonLeather },
      { amount: 1, item: Items.Needle },
      { amount: 1, item: Items.Thread },
    ],
    returns: [
      { amount: 1, item: Items.BlackDhideBody }
    ],
    actionsPerHour: 1750,
    requirments: {
      "levels": {
        "Crafting": 84
      },
    },
  },
  cutAmethyst: {
    id: "cutAmethyst",
    label: "cut amethyst",
    xp: 60,
    items: [
      { amount: 1, item: Items.Amethyst },
      { amount: 1, item: Items.Chisel },
    ],
    returns: [
      { amount: 15, item: Items.AmethystArrowtips }
    ],
    actionsPerHour: 2780,
    requirments: {
      "levels": {
        "Crafting": 83
      },
    },
  },
} as const satisfies Methods;