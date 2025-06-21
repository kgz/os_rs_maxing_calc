import { Items } from "../../types/items";
import type { Methods } from "../../types/method";

export default {
	brimhavenArena: {
		id: "brimhavenArena",
		label: "Brimhaven Agility Arena",
		xp: 30, // Base XP, increases with level
		items: [
			{ amount: 200, item: Items.Coins }, // Entry fee
		],
		returns: [],
		actionsPerHour: 1200, // Approximate, varies based on efficiency
		requirments: {
			"levels": {
				"Agility": 20
			},
		},
	},
	wildernessAgilityCourse: {
		id: "wildernessAgilityCourse",
		label: "Wilderness Agility Course",
		xp: 571, // XP per lap
		items: [],
		returns: [
			{ item: Items.Coins, amount: 16_022 }, // Approximate drop rate
		],
		actionsPerHour: 100, // Approximate laps per hour
		requirments: {
			"levels": {
				"Agility": 52
			},
		},
	},
	hallowedsepulchre: {
		id: "hallowedsepulchre",
		label: "Hallowed Sepulchre",
		xp: 6000, // Approximate XP per run, varies by floor
		items: [],
		returns: [],
		actionsPerHour: 10, // Approximate runs per hour
		requirments: {
			"levels": {
				"Agility": 62
			},
		},
	},
	rooftopCourses: {
		id: "rooftopCourses",
		label: "Rooftop Agility Courses",
		xp: 500, // Varies by course, this is a placeholder
		items: [],
		returns: [
			{ item: Items.MarkOfGrace, amount: 0.1 }, // Approximate drop rate
		],
		actionsPerHour: 200, // Varies by course
		requirments: {
			"levels": {
				"Agility": 10 // Varies by course, this is for the lowest level course
			},
		},
	},
	agilityPyramid: {
		id: "agilityPyramid",
		label: "Agility Pyramid",
		xp: 1000, // Approximate XP per lap
		items: [],
		returns: [
			{ item: Items.Coins, amount: 10000 }, // Pyramid top reward
		],
		actionsPerHour: 25, // Approximate laps per hour
		requirments: {
			"levels": {
				"Agility": 30
			},
		},
	},
	werewolfAgilityCourse: {
		id: "werewolfAgilityCourse",
		label: "Werewolf Agility Course",
		xp: 540, // XP per lap
		items: [],
		returns: [],
		actionsPerHour: 150, // Approximate laps per hour
		requirments: {
			"levels": {
				"Agility": 60
			},
		},
	},
	priffdinasAgilityCourse: {
		id: "priffdinasAgilityCourse",
		label: "Prifddinas Agility Course",
		xp: 1160, // XP per lap
		items: [],
		returns: [
			{ item: Items.CrystalShard, amount: 0.002 }, // Approximate drop rate
		],
		actionsPerHour: 75, // Approximate laps per hour
		requirments: {
			"levels": {
				"Agility": 75
			}
		},
	},
} as const satisfies Methods