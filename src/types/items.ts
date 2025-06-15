
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
	}
} as const;