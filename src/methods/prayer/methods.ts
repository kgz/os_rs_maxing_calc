import { Items } from "../../types/items";
import type { Methods } from "../../types/method";

export default {
	bdbga: {
		id: "bdbga",
		label: "baby dragon bones (gilded altar)",
		xp: 105,
		items: [
			{ amount: 1, item: Items.BabyDragonBones },
			{ amount: 5, item: Items.Coins },
		],
		returns: [],
		actionsPerHour: 2500,
		requirments: {
			"levels": {
				"Prayer": 15
			},
		},
	},
	dbga: {
		id: "dbga",
		label: "dragon bones (gilded altar)",
		xp: 252,
		items: [
			{ amount: 1, item: Items.DragonBones },
			{ amount: 5, item: Items.Coins },
		],
		returns: [],
		actionsPerHour: 2500,
		requirments: {
			"levels": {
				"Prayer": 30
			},
		},
	}

} as const satisfies Methods