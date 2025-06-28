import { Items } from "../../types/items";
import type { Methods } from "../../types/method";
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
            { amount: 1, item: Items.AbsorptionPotion4 },
            { amount: 0.5, item: Items.OverloadPotion4 },
        ],
        returns: [
            { amount: 400, item: Items.NightmareZonePoints }, // Estimated points per hour
        ],
        actionsPerHour: 1500, // Estimated kills per hour
        requirement: {
            "levels": {
                "Attack": 50
            },
        },
    },
    nmzHard: {
        id: "nmzHard",
        label: "Nightmare Zone (Hard)",
        xp: 100, // Average XP per kill
        items: [
            { amount: 1.5, item: Items.AbsorptionPotion4 },
            { amount: 0.5, item: Items.OverloadPotion4 },
        ],
        returns: [
            { amount: 800, item: Items.NightmareZonePoints }, // Estimated points per hour
        ],
        actionsPerHour: 1800, // Estimated kills per hour
        requirement: {
            "levels": {
                "Attack": 70
            },
        },
    }
} as const satisfies Methods