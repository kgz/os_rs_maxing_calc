import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateTargetLevel = createAsyncThunk(
	'skills/updateTargetLevel',
	async (payload: { id: string; targetLevel: number }, { dispatch }) => {
		dispatch(skillsSlice.actions.updateTargetLevelInternal(payload));
		return payload;
	}
);
