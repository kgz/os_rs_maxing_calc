import { Items } from "../../types/items";
import type { Method } from "../../types/method";

export default [
	{
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
	}
] as Method[]