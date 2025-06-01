import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { xpToLevel } from '../utils/xpCalculations';

// Define the Skill interface
export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  targetLevel: number;
}

// Define the state structure
interface SkillsState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  username: string;
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
};

// Async thunks
export const updateSkillLevel = createAsyncThunk(
  'skills/updateSkillLevel',
  async (payload: { id: string; level: number }, { getState, dispatch }) => {
    const state = getState() as { skills: SkillsState };
    const skill = state.skills.skills.find((s) => s.id === payload.id);
    if (skill) {
      const newXp = skill.xp;
      dispatch(skillsSlice.actions.updateSkillLevelInternal(payload));
      dispatch(updateSkillXp({ id: payload.id, xp: newXp }));
    }
    return payload;
  }
);

export const updateSkillXp = createAsyncThunk(
  'skills/updateSkillXp',
  async (payload: { id: string; xp: number }, { dispatch }) => {
    const newLevel = xpToLevel(payload.xp);
    dispatch(skillsSlice.actions.updateSkillXpInternal(payload));
    dispatch(skillsSlice.actions.updateSkillLevelInternal({ id: payload.id, level: newLevel }));
    return payload;
  }
);

export const updateTargetLevel = createAsyncThunk(
  'skills/updateTargetLevel',
  async (payload: { id: string; targetLevel: number }, { dispatch }) => {
    dispatch(skillsSlice.actions.updateTargetLevelInternal(payload));
    return payload;
  }
);

export const importCharacterStats = createAsyncThunk(
  'skills/importCharacterStats',
  async (skills: Skill[], { dispatch }) => {
    dispatch(skillsSlice.actions.importCharacterStatsInternal(skills));
    return skills;
  }
);

export const fetchCharacterStats = createAsyncThunk(
  'skills/fetchCharacterStats',
  async (username: string, { dispatch }) => {
    if (!username.trim()) {
      throw new Error('Please enter a username');
    }

    const corsProxy = 'https://corsproxy.io/';
    const apiUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(username)}`;
    const response = await fetch(`${corsProxy}?url=${apiUrl}`, {
      headers: { 
        'Origin': 'http://localhost:5173' // Replace with your actual origin in production
      }
    });

    if (!response.ok) {
      throw new Error(response.status === 404 
        ? 'Player not found' 
        : 'Failed to fetch data from OSRS HiScores');
    }

    const data = await response.text();
    const lines = data.split('\n');

    const skillOrder = [
      'overall', 'attack', 'defence', 'strength', 'hitpoints', 'ranged', 
      'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 
      'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 
      'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'
    ];

    const updatedSkills = skillOrder.slice(1).map((skillId, index) => {
      const [, level, xpStr] = lines[index + 1].split(',');
      const xp = parseInt(xpStr, 10);
      return {
        id: skillId,
        name: skillId.charAt(0).toUpperCase() + skillId.slice(1),
        level: parseInt(level, 10),
        xp: isNaN(xp) ? 0 : xp,
        targetLevel: 99
      };
    });

    return updatedSkills;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacterStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacterStats.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
        state.error = null;
      })
      .addCase(fetchCharacterStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch character stats';
      });
  },
});

// Export the actions
export const {
  setLoading,
  setError,
  setUsername,
} = skillsSlice.actions;

// Export the reducer
export default skillsSlice.reducer;