
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
	Coins: {
		id: 617,
		label: 'gp',
	}
} as const;