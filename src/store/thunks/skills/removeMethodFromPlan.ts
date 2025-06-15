import { createAsyncThunk } from "@reduxjs/toolkit";

export const removeMethodFromPlan = createAsyncThunk(
    'skills/removeMethodFromPlan',
    async (args: {
        planId: string,
        methodIndex: number,
        skill: string // Changed from optional to required
    }) => {
        return args;
    }
);