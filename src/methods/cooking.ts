import { Items } from "../types/items";
import type { Methods } from "../types/method";

// Helper function to calculate success rate based on level, is a linear interpolation function
const getCookSuccessRate = (currentLevel: number, baseLevel: number, maxLevel: number, minRate: number = 0.6, maxRate: number = 1.0) => {
	if (currentLevel >= maxLevel) return maxRate;
	if (currentLevel <= baseLevel) return minRate;

	// Linear interpolation between min and max rates
	const levelRange = maxLevel - baseLevel;
	const levelProgress = currentLevel - baseLevel;
	return minRate + (maxRate - minRate) * (levelProgress / levelRange);
};

// Helper function to calculate average rate across level range
const getAverageCookRate = (
	fromLevel: number,
	toLevel: number,
	baseLevel: number,
	maxLevel: number,
	minRate: number,
	maxRate: number,
	isBurnRate: boolean = false
) => {
	let totalRate = 0;
	let levels = 0;

	for (let level = fromLevel; level <= toLevel; level++) {
		const successRate = getCookSuccessRate(level, baseLevel, maxLevel, minRate, maxRate);
		totalRate += isBurnRate ? (1 - successRate) : successRate;
		levels++;
	}

	if (levels === 0) {
		const defaultRate = getCookSuccessRate(fromLevel, baseLevel, maxLevel, minRate, maxRate);
		return isBurnRate ? (1 - defaultRate) : defaultRate;
	}

	return totalRate / levels;
};

export default {
	shrimpAnchovies: {
		id: "shrimpAnchovies",
		label: "Shrimp & Anchovies",
		xp: 30, // Average XP per cook
		items: [
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 1, 34, 0.5, 1.0);
					return 1 / avgSuccessRate;
				},
				item: Items.RawShrimps
			},
		],
		returns: [
			{ amount: 1, item: Items.Shrimps },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 1, 34, 0.5, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntShrimps,
				link: "https://oldschool.runescape.wiki/w/Shrimps#Cooking_chance"
			}
		],
		actionsPerHour: 1300,
		requirement: {
			"levels": {},
		},
	},
	trout: {
		id: "trout",
		label: "Trout",
		xp: 70,
		items: [
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 15, 49, 0.53, 1.0);
					return 1 / avgSuccessRate;
				}, item: Items.RawTrout
			},
		],
		returns: [
			{ amount: 1, item: Items.Trout },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 15, 49, 0.53, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				}, item: Items.BurntTrout, link: "https://oldschool.runescape.wiki/w/Trout#Cooking_chance"
			},
		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 25, 58, 0.6172, 1.0);
					return 1 / avgSuccessRate;
				},
				item: Items.RawSalmon
			},
		],
		returns: [
			{ amount: 1, item: Items.Salmon },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 25, 58, 0.6172, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntSalmon,
				link: "https://oldschool.runescape.wiki/w/Salmon#Cooking_chance"
			},

		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 30, 99, 0.6172, 1.0);
					return 1 / avgSuccessRate;
				},
				item: Items.RawKarambwan
			},
		],
		returns: [
			{ amount: 1, item: Items.CookedKarambwan },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 30, 99, 0.6172, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntKarambwan,
				link: "https://oldschool.runescape.wiki/w/Cooked_karambwan#Cooking_chance"
			},

		],
		actionsPerHour: 1500,
		requirement: {
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
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 40, 74, 0.6, 1.0);
					return 1 / avgSuccessRate;
				},
				item: Items.RawLobster
			},
		],
		returns: [
			{ amount: 1, item: Items.Lobster },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 40, 74, 0.6, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntLobster,
			}
		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 45, 86, 0.5547, 1.0);
					return 1 / avgSuccessRate;
				}, item: Items.RawSwordfish
			},
		],
		returns: [
			{ amount: 1, item: Items.Swordfish },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 45, 86, 0.5547, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				}, item: Items.BurntSwordfish,

				link: "https://oldschool.runescape.wiki/w/Swordfish#Cooking_chance"
			},
		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 62, 92, 0.6875, 1.0);
					return 1 / avgSuccessRate;
				},
				item: Items.RawMonkfish
			},
		],
		returns: [
			{ amount: 1, item: Items.Monkfish },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 62, 92, 0.6875, 1.0);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntMonkfish,
				link: "https://oldschool.runescape.wiki/w/Monkfish#Cooking_chance"
			},
		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 80, 99, 0.6404, 0.793);
					return 1 / avgSuccessRate;
				},
				item: Items.RawShark
			},
		],
		returns: [
			{ amount: 1, item: Items.SharkCooked },
			{
				amount: (fromLevel: number, toLevel: number) => {
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 80, 99, 0.6404, 0.793);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntShark,
				link: "https://oldschool.runescape.wiki/w/Shark#Cooking_chance"
			},
		],
		actionsPerHour: 1300,
		requirement: {
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
			{
				amount: (fromLevel: number, toLevel: number) => {
					// Using fire rates: ~66.8% at level 84, stops burning completely at level 99
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 84, 99, 0.668, .7852);
					return 1 / avgSuccessRate;
				},
				item: Items.RawAnglerfish
			},
		],
		returns: [
			{ amount: 1, item: Items.Anglerfish },
			{
				amount: (fromLevel: number, toLevel: number) => {
					// Using fire rates: ~66.8% at level 84, stops burning completely at level 99
					const avgSuccessRate = getAverageCookRate(fromLevel, toLevel, 84, 99, 0.668, .7852);
					return (1 - avgSuccessRate) / avgSuccessRate;
				},
				item: Items.BurntAnglerfish,
				link: "https://oldschool.runescape.wiki/w/Anglerfish#Cooking_chance"
			},
		],
		actionsPerHour: 1300,
		requirement: {
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
		requirement: {
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
		requirement: {
			"levels": {
				"Cooking": 65
			},
		},
	}
} as const satisfies Methods