import { useMemo } from "react";
import type { SkillsRecord } from "../store/slices/characterSlice";

// Helper function to find the last character
export const useLastCharacter = (characters: Record<string, SkillsRecord>) => {
  return useMemo(() => {
	const last = Object.entries(characters).sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated).at(0);
	if (last !== undefined) {
	  return {
		...last[1],
		username: last[0]
	  }
	}
	return null;
  }, [characters]);
};
