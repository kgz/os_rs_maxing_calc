import type { TModifiers } from ".";

export const cookingModifiers = { 
	gauntlets: {
		image: "https://oldschool.runescape.wiki/images/thumb/Cooking_gauntlets_detail.png/130px-Cooking_gauntlets_detail.png?9a324",
		label: "Cooking Gauntlets",
		stats: "+10%"
	}
} as const satisfies TModifiers