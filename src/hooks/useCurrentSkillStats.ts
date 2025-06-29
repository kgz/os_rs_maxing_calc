import { useMemo } from "react";
import type { SkillsRecord } from "../store/slices/characterSlice";
import { xpToLevel } from "../utils/xpCalculations";

// Helper function to get current skill XP and level
export const useCurrentSkillStats = (lastCharacter: (SkillsRecord & { username: string }) | null, skillId: string | undefined) => {
	const currentSkill = useMemo(() => {
		if (!lastCharacter || !skillId) {
			return null;
		}
		return lastCharacter?.[skillId as keyof SkillsRecord] ?? null;
	}, [lastCharacter, skillId]);

	const currentSkillXp = useMemo(() => {
		const lastEpoch = Math.max(...Object.keys(currentSkill ?? {}).map(Number));

		if (typeof currentSkill !== 'object') {
			return 1;
		}

		if (lastEpoch && lastEpoch !== Infinity && lastEpoch !== -Infinity) {
			return (currentSkill ?? {})[Number(lastEpoch)] ?? 1;
		}

		return 1;
	}, [currentSkill]);

	const currentSkillLevel = useMemo(() => {
		return xpToLevel(currentSkillXp);
	}, [currentSkillXp]);

	return { currentSkillXp, currentSkillLevel };
};