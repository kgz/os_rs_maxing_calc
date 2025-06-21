import { createAsyncThunk } from "@reduxjs/toolkit";

export const setPlanFromLevel = createAsyncThunk(
    'skills/setPlanFromLevel',
    async (args: {
        level: number,
        plan: string,
        methodIndex: number,
        skill: string // Changed from optional to required
		characterName: string
    }) => {
        return args;
    }
);