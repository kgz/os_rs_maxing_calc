import { createSlice } from '@reduxjs/toolkit';
import { fetchCharacterStats } from '../thunks/character/fetchCharacterStats';
import type { skillsEnum } from '../../types/skillsResponse';

type SkillData = {
  [epoch: number]: number;
};

export type SkillsRecord = {
  [K in keyof typeof skillsEnum]?: SkillData;
} & {
  lastUpdated: number;
};

type CharacterStatsState = {
  [character_name: string]: SkillsRecord;
};

const initialState: CharacterStatsState = {

}

// Create the skills slice
const slice = createSlice({
	name: 'characterStats',
	initialState,
	reducers: {
		
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCharacterStats.fulfilled, (state, action) => {
			const characterName = action.meta.arg;
			// for each stat, check if its already in [chcracter_name][skill_id][epoch]
			// only if its different from the previous epoch add it to the state
			const stats = action.payload.skills;
			for (const skill of stats) {

				const existingSkill = state[characterName] || {};
				
				const lastEpoch = Math.max(...Object.keys(existingSkill[skill.name] ?? {}).map(Number));
				if (lastEpoch && lastEpoch !== Infinity && lastEpoch !== -Infinity) {
					const lastSkillValue = (existingSkill[skill.name] ?? {})[Number(lastEpoch)] ?? null;



					const diff = skill.xp - lastSkillValue;
					if (diff <= 0) {
						continue;
					}
				}	

				const now = (new Date()).valueOf();

				const newSkill = {
                    ...existingSkill[skill.name],
                    [now]: skill.xp
                };

				state[characterName] = {
					...existingSkill,
                    [skill.name]: newSkill
                };

			}

			state[characterName]['lastUpdated'] = (new Date()).valueOf();
	})
	builder.addCase(fetchCharacterStats.rejected, (_, action) => {
		console.warn('Failed to fetch character stats:', action.error.message);
		throw new Error('Failed to fetch character stats');
	
	})		
		
		
		return builder
	},
});


// Export the reducer
export const characterReducer = slice.reducer;