
export type Item = {
	id: number;
	label: string;
	imageSrc?: string; // Optional: Add an image source for the item, if available.
	// other properties
}

export const Items: {
	[key: string]: Item;
} = {
	BabyDragonBones: {
		id: 534,
		label: 'Baby Dragon Bones',
		

	},
	DragonBones: {
        id: 536,
        label: 'Dragon Bones',
    },
    // Add more items as needed...
	Coins: {
		id: 995,
		label: 'gp',
		imageSrc: "https://oldschool.runescape.wiki/images/Coins_250.png?c2755"
	}
} as const;