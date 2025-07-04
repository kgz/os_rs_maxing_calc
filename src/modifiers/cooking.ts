import type { TModifiers } from ".";

export const cookingModifiers = { 
	gauntlets: {
		image: "https://oldschool.runescape.wiki/images/thumb/Cooking_gauntlets_detail.png/130px-Cooking_gauntlets_detail.png?9a324",
		label: "Cooking Gauntlets",
		stats: "+10%",
		uniqueWith: []
	},
	hosidius_easy: {
		image: "https://oldschool.runescape.wiki/images/thumb/Rada%27s_blessing_1_detail.png/130px-Rada%27s_blessing_1_detail.png?4c58f",
		label: "Hosidius - Easy Diary",
        stats: "+5%",
		uniqueWith: ["hosidius_elite"]
	},
	hosidius_elite: {
		image: "https://oldschool.runescape.wiki/images/thumb/Rada%27s_blessing_4_detail.png/130px-Rada%27s_blessing_4_detail.png?4c58f",
		label: "Hosidius - Elite Diary",
        stats: "+10%",
		uniqueWith: ["hosidius_easy"]
	}

} as const satisfies TModifiers