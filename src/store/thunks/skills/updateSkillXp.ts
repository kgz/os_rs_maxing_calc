export const updateSkillXp = createAsyncThunk(
	'skills/updateSkillXp',
	async (payload: { id: string; xp: number }, { dispatch }) => {
		const newLevel = xpToLevel(payload.xp);
		dispatch(skillsSlice.actions.updateSkillXpInternal(payload));
		dispatch(skillsSlice.actions.updateSkillLevelInternal({ id: payload.id, level: newLevel }));
		return payload;
	}
);