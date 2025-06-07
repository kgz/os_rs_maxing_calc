import { createSlice, current } from '@reduxjs/toolkit';
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
			const temp1 = current(state);
			console.log({temp1})
			const stats = action.payload.skills;
			for (const skill of stats) {

				const existingSkill = state[characterName] || {};
				
				const lastEpoch = Math.max(...Object.keys(existingSkill[skill.name] ?? {}).map(Number));
				console.log('last epoch:', lastEpoch, 'current:', (new Date()).valueOf(), 'diff:', (new Date()).valueOf() - Number(lastEpoch) < 1)
				if (lastEpoch && lastEpoch !== Infinity && lastEpoch !== -Infinity) {
					const lastSkillValue = (existingSkill[skill.name] ?? {})[Number(lastEpoch)] ?? null;



					const diff = skill.xp - lastSkillValue;
					if (diff <= 0) {
						console.log('skipping', skill.name, 'last epoch:', lastEpoch, 'current:', (new Date()).valueOf(), 'diff:', (new Date()).valueOf() - Number(lastEpoch) < 1)
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
			const temp = current(state);
			console.log({temp})



		
	})
		
		
		
		return builder
	},
});


// Export the reducer
export const characterReducer = slice.reducer;