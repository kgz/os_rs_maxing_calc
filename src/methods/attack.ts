import { Items } from "../types/items";
import type { Methods } from "../types/method";
export default {
    waterfall: {
        id: "waterfall",
        label: "Waterfall Quest",
        xp: 13750, // Combined Attack and Strength XP from the quest
        items: [],
        returns: [],
        actionsPerHour: 1, // One-time quest
        requirement: {
            "levels": {},
        },
    },
    sandCrabs: {
        id: "sandCrabs",
        label: "Sand Crabs",
        xp: 60, // XP per kill
        items: [
            { amount: 0.1, item: Items.PrayerPotion4 }, // Estimated consumption
            { amount: 0.2, item: Items.SharkCooked }, // Estimated food consumption
        ],
        returns: [],
        actionsPerHour: 1200, // Estimated kills per hour
        requirement: {
            "levels": {
                "Attack": 30
            },
        },
    },
    nmzNormal: {
        id: "nmzNormal",
        label: "Nightmare Zone (Normal)",
        xp: 80, // Average XP per kill
        items: [
            // { amount: 1, item: Items.AbsorptionPotion4 },
            // { amount: 0.5, item: Items.OverloadPotion4 },
        ],
        returns: [
            // { amount: 400, item: Items.NightmareZonePoints }, // Estimated points per hour
        ],
        actionsPerHour: 1500, // Estimated kills per hour
        requirement: {
            "levels": {
                "Attack": 50
            },
        },
    },
    // Generic training methods at different XP rates
    generic10k: {
        id: "generic10k",
        label: "10k XP/hr",
        xp: 10000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic20k: {
        id: "generic20k",
        label: "20k XP/hr",
        xp: 20000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic30k: {
        id: "generic30k",
        label: "30k XP/hr",
        xp: 30000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic40k: {
        id: "generic40k",
        label: "40k XP/hr",
        xp: 40000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic50k: {
        id: "generic50k",
        label: "50k XP/hr",
        xp: 50000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic60k: {
        id: "generic60k",
        label: "60k XP/hr",
        xp: 60000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic70k: {
        id: "generic70k",
        label: "70k XP/hr",
        xp: 70000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic80k: {
        id: "generic80k",
        label: "80k XP/hr",
        xp: 80000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic90k: {
        id: "generic90k",
        label: "90k XP/hr",
        xp: 90000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic100k: {
        id: "generic100k",
        label: "100k XP/hr",
        xp: 100000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic110k: {
        id: "generic110k",
        label: "110k XP/hr",
        xp: 110000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic120k: {
        id: "generic120k",
        label: "120k XP/hr",
        xp: 120000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic130k: {
        id: "generic130k",
        label: "130k XP/hr",
        xp: 130000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic140k: {
        id: "generic140k",
        label: "140k XP/hr",
        xp: 140000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic150k: {
        id: "generic150k",
        label: "150k XP/hr",
        xp: 150000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic160k: {
        id: "generic160k",
        label: "160k XP/hr",
        xp: 160000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic170k: {
        id: "generic170k",
        label: "170k XP/hr",
        xp: 170000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic180k: {
        id: "generic180k",
        label: "180k XP/hr",
        xp: 180000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic190k: {
        id: "generic190k",
        label: "190k XP/hr",
        xp: 190000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    generic200k: {
        id: "generic200k",
        label: "200k XP/hr",
        xp: 200000,
        items: [],
        returns: [],
        actionsPerHour: 1,
        requirement: {
            "levels": {}
        },
    },
    nmzHard: {
        id: "nmzHard",
        label: "Nightmare Zone (Hard)",
        xp: 100, // Average XP per kill
        items: [
            // { amount: 1.5, item: Items.AbsorptionPotion4 },
            // { amount: 0.5, item: Items.OverloadPotion4 },
        ],
        returns: [
            // { amount: 800, item: Items.NightmareZonePoints }, // Estimated points per hour
        ],
        actionsPerHour: 1800, // Estimated kills per hour
        requirement: {
            "levels": {
                "Attack": 70
            },
        },
    }
} as const satisfies Methods