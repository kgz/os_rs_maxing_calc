
export type Item = {
	id: number;
	label: string;
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
	},
    
    // New items for crafting
    Leather: {
        id: 1741,
        label: 'Leather',
    },
    Needle: {
        id: 1733,
        label: 'Needle',
    },
    Thread: {
        id: 1734,
        label: 'Thread',
    },
    LeatherGloves: {
        id: 1059,
        label: 'Leather gloves',
    },
    LeatherBoots: {
        id: 1061,
        label: 'Leather boots',
    },
    LeatherCowl: {
        id: 1063,
        label: 'Leather cowl',
    },
} as const;
