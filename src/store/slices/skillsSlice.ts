import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { xpToLevel } from '../../utils/xpCalculations';

// Define the Skill interface
export interface Skill {
	id: string;
	name: string;
	level: number;
	xp: number;
	targetLevel: number;
}

// Add this interface if it doesn't exist already
export interface TrainingMethod {
	id: string;
	name: string;
	levelReq: number;
	xpPerHour: number;
	intensity: 'Low' | 'Medium' | 'High';
	startLevel: number;
	endLevel: number;
}

// Define the state structure
interface SkillsState {
	skills: Skill[];
	loading: boolean;
	error: string | null;
	username: string;
	trainingMethods: Record<string, TrainingMethod[]>;
}

// Initial state for the skills
const initialState: SkillsState = {
	skills: [
		{ id: 'attack', name: 'Attack', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'defence', name: 'Defence', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'strength', name: 'Strength', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'hitpoints', name: 'Hitpoints', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'ranged', name: 'Ranged', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'prayer', name: 'Prayer', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'magic', name: 'Magic', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'cooking', name: 'Cooking', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'woodcutting', name: 'Woodcutting', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'fletching', name: 'Fletching', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'fishing', name: 'Fishing', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'firemaking', name: 'Firemaking', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'crafting', name: 'Crafting', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'smithing', name: 'Smithing', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'mining', name: 'Mining', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'herblore', name: 'Herblore', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'agility', name: 'Agility', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'thieving', name: 'Thieving', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'slayer', name: 'Slayer', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'farming', name: 'Farming', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'runecrafting', name: 'Runecrafting', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'hunter', name: 'Hunter', level: 1, xp: 0, targetLevel: 99 },
		{ id: 'construction', name: 'Construction', level: 1, xp: 0, targetLevel: 99 },
	],
	loading: false,
	error: null,
	username: '',
	trainingMethods: {
		woodcutting: [
			{id: 'method-1', name: 'Regular trees', levelReq: 1, xpPerHour: 7000, intensity: 'Low', startLevel: 1, endLevel: 15 },
			{id: 'method-2', name: 'Oak trees', levelReq: 15, xpPerHour: 15000, intensity: 'Low', startLevel: 15, endLevel: 30 },
			{id: 'method-3', name: 'Willow trees', levelReq: 30, xpPerHour: 35000, intensity: 'Medium', startLevel: 30, endLevel: 35 },
			{id: 'method-4', name: 'Teak trees', levelReq: 35, xpPerHour: 65000, intensity: 'High', startLevel: 35, endLevel: 45 },
			{id: 'method-5', name: 'Maple trees', levelReq: 45, xpPerHour: 45000, intensity: 'Medium', startLevel: 45, endLevel: 60 },
			{id: 'method-6', name: 'Yew trees', levelReq: 60, xpPerHour: 50000, intensity: 'Low', startLevel: 60, endLevel: 90 },
			{id: 'method-7', name: 'Redwood trees', levelReq: 90, xpPerHour: 70000, intensity: 'Low', startLevel: 90, endLevel: 99 },
			// ... (add other woodcutting methods)
		],
		smithing: [
			//... (add smithing methods)
			{id: 'method-1', name: 'Iron ore', levelReq: 1, xpPerHour: 7000, intensity: 'Low', startLevel: 1, endLevel: 15 },

        ],
		// ... (add other skills' training methods)
	},
};




export const importCharacterStats = createAsyncThunk(
	'skills/importCharacterStats',
	async (skills: Skill[], { dispatch }) => {
		dispatch(skillsSlice.actions.importCharacterStatsInternal(skills));
		return skills;
	}
);



export const updateTrainingMethod = createAsyncThunk(
	'skills/updateTrainingMethod',
	async (payload: { skillId: string; methodIndex: number; method: TrainingMethod }, { getState, dispatch }) => {
		// Here you would typically make an API call if you're storing this data on a server
		// For now, we'll just return the payload to update the local state
		return payload;
	}
);


// Create the skills slice
const skillsSlice = createSlice({
	name: 'skills',
	initialState,
	reducers: {
		updateSkillLevelInternal: (state, action: PayloadAction<{ id: string; level: number }>) => {
			const { id, level } = action.payload;
			const skill = state.skills.find((skill) => skill.id === id);
			if (skill) {
				skill.level = level;
			}
		},
		updateSkillXpInternal: (state, action: PayloadAction<{ id: string; xp: number }>) => {
			const { id, xp } = action.payload;
			const skill = state.skills.find((skill) => skill.id === id);
			if (skill) {
				skill.xp = xp;
			}
		},
		updateTargetLevelInternal: (state, action: PayloadAction<{ id: string; targetLevel: number }>) => {
			const { id, targetLevel } = action.payload;
			const skill = state.skills.find((skill) => skill.id === id);
			if (skill) {
				skill.targetLevel = targetLevel;
			}
		},
		importCharacterStatsInternal: (state, action: PayloadAction<Skill[]>) => {
			state.skills = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setUsername: (state, action: PayloadAction<string>) => {
			state.username = action.payload;
		},
		updateTrainingMethodInternal: (state, action: PayloadAction<{ skillId: string; methodIndex: number; method: TrainingMethod }>) => {
			const { skillId, methodIndex, method } = action.payload;
			if (state.trainingMethods[skillId]) {
				state.trainingMethods[skillId][methodIndex] = method;
			}
		},
		removeTrainingMethod: (state, action: PayloadAction<{ skillId: string; methodIndex: number }>) => {
			const { skillId, methodIndex } = action.payload;
			if (state.trainingMethods[skillId]) {
				state.trainingMethods[skillId].splice(methodIndex, 1);
			}
		},
		addTrainingMethod: (state, action: PayloadAction<{ skillId: string; method: TrainingMethod }>) => {
			const { skillId, method } = action.payload;
			if (!state.trainingMethods[skillId]) {
				state.trainingMethods[skillId] = [];
			}
			state.trainingMethods[skillId].push(method);
		},
		reorderTrainingMethods: (state, action: PayloadAction<{ skillId: string; startIndex: number; endIndex: number }>) => {
			const { skillId, startIndex, endIndex } = action.payload;
			if (state.trainingMethods[skillId]) {
				const [reorderedItem] = state.trainingMethods[skillId].splice(startIndex, 1);
				state.trainingMethods[skillId].splice(endIndex, 0, reorderedItem);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateTrainingMethod.fulfilled, (state, action) => {
				const { skillId, methodIndex, method } = action.payload;
				if (state.trainingMethods[skillId]) {
					state.trainingMethods[skillId][methodIndex] = method;
				}
			});
	},
});

// Export the actions
export const {
	setLoading,
	setError,
	setUsername,
	updateTrainingMethodInternal,
	removeTrainingMethod,
	addTrainingMethod,
	reorderTrainingMethods,

} = skillsSlice.actions;

// Export the reducer
export const skillsRecider = skillsSlice.reducer;