import { Items } from "../types/items";

export default {
  // Allotments
  potatoSeeds: {
    id: "potatoSeeds",
    label: "potato seeds",
    xp: 8,
    items: [
      { amount: 1, item: Items.PotatoSeed },
    ],
    returns: [
      { amount: 4, item: Items.Potato }
    ],
    actionsPerHour: 5, // Based on growth cycles
    requirement: {
      "levels": {
        "Farming": 1
      },
    },
  },
  onionSeeds: {
    id: "onionSeeds",
    label: "onion seeds",
    xp: 9.5,
    items: [
      { amount: 1, item: Items.OnionSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 3, item: Items.Onion }
    ],
    actionsPerHour: 5,
    requirement: {
      "levels": {
        "Farming": 5
      },
    },
  },
  cabbageSeeds: {
    id: "cabbageSeeds",
    label: "cabbage seeds",
    xp: 10,
    items: [
      { amount: 1, item: Items.CabbageSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 3, item: Items.Cabbage }
    ],
    actionsPerHour: 5,
    requirement: {
      "levels": {
        "Farming": 7
      },
    },
  },
  tomatoSeeds: {
    id: "tomatoSeeds",
    label: "tomato seeds",
    xp: 12.5,
    items: [
      { amount: 1, item: Items.TomatoSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 3, item: Items.Tomato }
    ],
    actionsPerHour: 5,
    requirement: {
      "levels": {
        "Farming": 12
      },
    },
  },
  
  // Herbs
  guamSeeds: {
    id: "guamSeeds",
    label: "guam seeds",
    xp: 12.5,
    items: [
      { amount: 1, item: Items.GuamSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 6, item: Items.GuamLeaf }
    ],
    actionsPerHour: 8,
    requirement: {
      "levels": {
        "Farming": 9
      },
    },
  },
  marrentillSeeds: {
    id: "marrentillSeeds",
    label: "marrentill seeds",
    xp: 15,
    items: [
      { amount: 1, item: Items.MarrentillSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 6, item: Items.MarrentillHerb }
    ],
    actionsPerHour: 8,
    requirement: {
      "levels": {
        "Farming": 14
      },
    },
  },
  ranarr: {
    id: "ranarr",
    label: "ranarr seeds",
    xp: 30.5,
    items: [
      { amount: 1, item: Items.RanarrSeed },
      { amount: 1, item: Items.Dibber },
    ],
    returns: [
      { amount: 6, item: Items.RanarrWeed }
    ],
    actionsPerHour: 8,
    requirement: {
      "levels": {
        "Farming": 32
      },
    },
  },
  
  // Trees
  oakSapling: {
    id: "oakSapling",
    label: "oak sapling",
    xp: 481.3,
    items: [
      { amount: 1, item: Items.OakSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.5, // Trees take longer to grow
    requirement: {
      "levels": {
        "Farming": 15
      },
    },
  },
  willowSapling: {
    id: "willowSapling",
    label: "willow sapling",
    xp: 1481.5,
    items: [
      { amount: 1, item: Items.WillowSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.5,
    requirement: {
      "levels": {
        "Farming": 30
      },
    },
  },
  mapleSapling: {
    id: "mapleSapling",
    label: "maple sapling",
    xp: 3448.4,
    items: [
      { amount: 1, item: Items.MapleSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.5,
    requirement: {
      "levels": {
        "Farming": 45
      },
    },
  },
  yewSapling: {
    id: "yewSapling",
    label: "yew sapling",
    xp: 7069.9,
    items: [
      { amount: 1, item: Items.YewSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.5,
    requirement: {
      "levels": {
        "Farming": 60
      },
    },
  },
  magicSapling: {
    id: "magicSapling",
    label: "magic sapling",
    xp: 13768.3,
    items: [
      { amount: 1, item: Items.MagicSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.5,
    requirement: {
      "levels": {
        "Farming": 75
      },
    },
  },
  
  // Fruit Trees
  appleSapling: {
    id: "appleSapling",
    label: "apple sapling",
    xp: 1199.5,
    items: [
      { amount: 1, item: Items.AppleSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [
      { amount: 6, item: Items.Apple }
    ],
    actionsPerHour: 0.3,
    requirement: {
      "levels": {
        "Farming": 27
      },
    },
  },
  bananaSapling: {
    id: "bananaSapling",
    label: "banana sapling",
    xp: 1750.5,
    items: [
      { amount: 1, item: Items.BananaSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [
      { amount: 6, item: Items.Banana }
    ],
    actionsPerHour: 0.3,
    requirement: {
      "levels": {
        "Farming": 33
      },
    },
  },
  palmSapling: {
    id: "palmSapling",
    label: "palm sapling",
    xp: 10150.1,
    items: [
      { amount: 1, item: Items.PalmSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [
      { amount: 6, item: Items.Coconut }
    ],
    actionsPerHour: 0.3,
    requirement: {
      "levels": {
        "Farming": 68
      },
    },
  },
  
  // Special methods
  titheFarm: {
    id: "titheFarm",
    label: "tithe farm",
    xp: 6000, // XP per hour estimate
    items: [],
    returns: [],
    actionsPerHour: 1, // Represents 1 hour of continuous activity
    requirement: {
      "levels": {
        "Farming": 34
      },
    },
  },
  hardwoodTrees: {
    id: "hardwoodTrees",
    label: "hardwood trees",
    xp: 14833, // Combined XP from all 3 hardwood trees
    items: [
      { amount: 1, item: Items.TeakSapling },
      { amount: 1, item: Items.MahoganySapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.1, // Very slow growth rate
    requirement: {
      "levels": {
        "Farming": 55
      },
    },
  },
  calquatSapling: {
    id: "calquatSapling",
    label: "calquat sapling",
    xp: 12096,
    items: [
      { amount: 1, item: Items.CalquatSapling },
      { amount: 1, item: Items.Spade },
    ],
    returns: [
      { amount: 6, item: Items.CalquatFruit }
    ],
    actionsPerHour: 0.2,
    requirement: {
      "levels": {
        "Farming": 72
      },
    },
  },
  spiritTree: {
    id: "spiritTree",
    label: "spirit tree",
    xp: 19301.8,
    items: [
      { amount: 1, item: Items.SpiritSeed },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.1,
    requirement: {
      "levels": {
        "Farming": 83
      },
    },
  },
  hesporiSeed: {
    id: "hesporiSeed",
    label: "hespori seed",
    xp: 12600,
    items: [
      { amount: 1, item: Items.HesporiSeed },
      { amount: 1, item: Items.Spade },
    ],
    returns: [],
    actionsPerHour: 0.05, // Very rare seed
    requirement: {
      "levels": {
        "Farming": 65,
        "Combat": 80
      },
    },
  },
} as const satisfies Methods;