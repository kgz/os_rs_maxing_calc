import { createAsyncThunk } from "@reduxjs/toolkit";

export const setPlanFromLevel = createAsyncThunk(
	'skills/setPlanFromLevel',
	async (args: {
		methodIndex: number,
        level: number,
        plan: string
	}) => {
        return args;
    }
);