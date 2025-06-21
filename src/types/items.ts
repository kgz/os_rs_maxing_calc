export type Item = {
    id: number;
    label: string;
    // other properties
}

export const Items = {
    // Existing items
    BabyDragonBones: {
        id: 534,
        label: 'Baby Dragon Bones',
    },
    DragonBones: {
        id: 536,
        label: 'Dragon Bones',
    },
    Coins: {
        id: 995,
        label: 'gp',
    },
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
        id: 1167,
        label: 'Leather cowl',
    },
    LeatherVambraces: {
        id: 1063,
        label: 'Leather vambraces',
    },
    LeatherBody: {
        id: 1129,
        label: 'Leather body',
    },
    
    // Gems and cutting tools
    Chisel: {
        id: 1755,
        label: 'Chisel',
    },
    UncutSapphire: {
        id: 1623,
        label: 'Uncut sapphire',
    },
    Sapphire: {
        id: 1607,
        label: 'Sapphire',
    },
    UncutEmerald: {
        id: 1621,
        label: 'Uncut emerald',
    },
    Emerald: {
        id: 1605,
        label: 'Emerald',
    },
    UncutRuby: {
        id: 1619,
        label: 'Uncut ruby',
    },
    Ruby: {
        id: 1603,
        label: 'Ruby',
    },
    UncutDiamond: {
        id: 1617,
        label: 'Uncut diamond',
    },
    Diamond: {
        id: 1601,
        label: 'Diamond',
    },
    Amethyst: {
        id: 21347,
        label: 'Amethyst',
    },
    AmethystArrowtips: {
        id: 21350,
        label: 'Amethyst arrowtips',
    },
    
    // Battlestaffs and orbs
    Battlestaff: {
        id: 1391,
        label: 'Battlestaff',
    },
    WaterOrb: {
        id: 571,
        label: 'Water orb',
    },
    EarthOrb: {
        id: 575,
        label: 'Earth orb',
    },
    FireOrb: {
        id: 569,
        label: 'Fire orb',
    },
    WaterBattlestaff: {
        id: 1395,
        label: 'Water battlestaff',
    },
    EarthBattlestaff: {
        id: 1399,
        label: 'Earth battlestaff',
    },
    FireBattlestaff: {
        id: 1393,
        label: 'Fire battlestaff',
    },
    
    // Dragon hides and bodies
    GreenDragonLeather: {
        id: 1745,
        label: 'Green dragon leather',
    },
    BlueDragonLeather: {
        id: 2505,
        label: 'Blue dragon leather',
    },
    RedDragonLeather: {
        id: 2507,
        label: 'Red dragon leather',
    },
    BlackDragonLeather: {
        id: 2509,
        label: 'Black dragon leather',
    },
    GreenDhideBody: {
        id: 1135,
        label: "Green d'hide body",
    },
    BlueDhideBody: {
        id: 2499,
        label: "Blue d'hide body",
    },
    RedDhideBody: {
        id: 2501,
        label: "Red d'hide body",
    },
    BlackDhideBody: {
        id: 2503,
        label: "Black d'hide body",
    },
    
    // Prayer training items
    SuperiorDragonBones: {
        id: 22124,
        label: 'Superior dragon bones',
    },
    BlessedBoneShards: {
        id: 29381,
        label: 'Blessed bone shards',
    },
    JugOfWine: {
        id: 1993,
        label: 'Jug of wine',
    },
    JugOfBlessedWine: {
        id: 29098,
        label: 'Jug of blessed wine',
    },
    SunfireSplinters: {
        id: 28924,
        label: 'Sunfire splinters',
    },
    JugOfBlessedSunfireWine: {
        id: 29102,
        label: 'Jug of blessed sunfire wine',
    },
    PotOfSlime: {
        id: 4286,
        label: 'Pot of slime',
    },
    EnsouledDragonHead: {
        id: 13511,
        label: 'Ensouled dragon head',
    },
    DemonAshes: {
        id: 592,
        label: 'Demon ashes',
    },
    BloodRune: {
        id: 565,
        label: 'Blood rune',
    },
    SoulRune: {
        id: 566,
        label: 'Soul rune',
    },
    
    // Urium remains for zealot robes
    UriumRemains: {
        id: 24792,
        label: 'Urium remains',
    },
    FiyrRemains: {
        id: 24790,
        label: 'Fiyr remains',
    },
    GoldKey: {
        id: 24795,
        label: 'Gold key',
    },
    
    // Zealot's robes
    ZealotsRobeTop: {
        id: 24943,
        label: "Zealot's robe top",
    },
    ZealotsRobeBottom: {
        id: 24946,
        label: "Zealot's robe bottom",
    },
    ZealotsHood: {
        id: 24949,
        label: "Zealot's hood",
    },
    ZealotsBoots: {
        id: 24952,
        label: "Zealot's boots",
    },
	CrystalShard: {
		id: 23962,
        label: "Crystal Shard",
	},
	MarkOfGrace: {
		id: 11849,
        label: "Mark of Grace",
	},
	WildernessAgilityTicket: {
		id: 29460,
        label: "Wilderness Agility Ticket",
	}
} as const;