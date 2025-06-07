import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateSkillXp } from "../../slices/skillsSlice";

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
