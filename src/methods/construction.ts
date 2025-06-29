import type { Methods } from "../types/method";
import { Items } from "../types/items";

export default {
  daddysHome: {
    id: "daddysHome",
    label: "Daddy's Home Miniquest",
    xp: 944,
    actionsPerHour: 1,
    items: [],
    returns: [],
    requirement: {
      levels: {},
    }
  },
  baggedPlants: {
    id: "baggedPlants",
    label: "Bagged Plants",
    xp: 31,
    actionsPerHour: 3800,
    items: [
      {
        item: Items.Coins,
        amount: 1000
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 1
      },
    }
  },
  oakLarders: {
    id: "oakLarders",
    label: "Oak Larders",
    xp: 480,
    actionsPerHour: 375,
    items: [
      {
        item: Items.Coins,
        amount: 3000
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 33
      },
    }
  },
  mahoganyTables: {
    id: "mahoganyTables",
    label: "Mahogany Tables",
    xp: 840,
    actionsPerHour: 535,
    items: [
      {
        item: Items.Coins,
        amount: 12000
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 52
      },
    }
  },
  mahoganyHomes: {
    id: "mahoganyHomes",
    label: "Mahogany Homes",
    xp: 400,
    actionsPerHour: 300,
    items: [
      {
        item: Items.Coins,
        amount: 1400
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 1
      },
    }
  },
  mountedMythicalCapes: {
    id: "mountedMythicalCapes",
    label: "Mounted Mythical Capes",
    xp: 370,
    actionsPerHour: 675,
    items: [
      {
        item: Items.Coins,
        amount: 3100
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 50
      }
    }
  },
  teakGardenBenches: {
    id: "teakGardenBenches",
    label: "Teak Garden Benches",
    xp: 540,
    actionsPerHour: 610,
    items: [
      {
        item: Items.Coins,
        amount: 4200
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 66
      },
    }
  },
  oakDungeonDoors: {
    id: "oakDungeonDoors",
    label: "Oak Dungeon Doors",
    xp: 600,
    actionsPerHour: 665,
    items: [
      {
        item: Items.Coins,
        amount: 4100
      }
    ],
    returns: [],
    requirement: {
      levels: {
        Construction: 74
      },
    }
  }
} as const satisfies Methods;