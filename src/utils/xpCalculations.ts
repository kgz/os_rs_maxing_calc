export const levelData = [
  0,
  83,
  174,
  276,
  388,
  512,
  650,
  801,
  969,
  1154,
  1358,
  1584,
  1833,
  2107,
  2411,
  2746,
  3115,
  3523,
  3973,
  4470,
  5018,
  5624,
  6291,
  7028,
  7842,
  8740,
  9730,
  10824,
  12031,
  13363,
  14833,
  16456,
  18247,
  20224,
  22406,
  24815,
  27473,
  30408,
  33648,
  37224,
  41171,
  45529,
  50339,
  55649,
  61512,
  67983,
  75127,
  83014,
  91721,
  101333,
  111945,
  123660,
  136594,
  150872,
  166636,
  184040,
  203254,
  224466,
  247886,
  273742,
  302288,
  333804,
  368599,
  407015,
  449428,
  496254,
  547953,
  605032,
  668051,
  737627,
  814445,
  899257,
  992895,
  1096278,
  1210421,
  1336443,
  1475581,
  1629200,
  1798808,
  1986068,
  2192818,
  2421087,
  2673114,
  2951373,
  3258594,
  3597792,
  3972294,
  4385776,
  4842295,
  5346332,
  5902831,
  6517253,
  7195629,
  7944614,
  8771558,
  9684577,
  10692629,
  11805606,
  13034431
];

export function xpToLevel(xp: number): number {
  for (let level = 1; level < levelData.length; level++) {
    if (xp < levelData[level]) {
      return level;
    }
  }
  return 99; // Max level
}

export function remainingXPToTarget(currentXP: number, targetLevel: number): number {
  if (targetLevel > 99 || targetLevel < 1) {
    return 0; // Invalid target level
  }
  const targetXP = levelData[targetLevel - 1];
  return Math.max(0, targetXP - currentXP);
}

export function percentToNextLevel(currentXP: number): number {
  const currentLevel = xpToLevel(currentXP);
  if (currentLevel >= 99) {
    return 100; // Already at max level
  }
  const currentLevelXP = levelData[currentLevel - 1];
  const nextLevelXP = levelData[currentLevel];
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
  return Math.min((xpInCurrentLevel / xpRequiredForNextLevel) * 100, 99.9);
}

export function xpToNextLevel(currentXP: number): number {
  const currentLevel = xpToLevel(currentXP);
  if (currentLevel >= 99) {
    return 0; // Already at max level
  }
  const nextLevelXP = levelData[currentLevel];
  return nextLevelXP - currentXP;
}


export function levelToXp(level: number): number {
	if (level < 1 || level > 99) {
        return 0; // Invalid level
    }
    return levelData[level - 1];
}
	