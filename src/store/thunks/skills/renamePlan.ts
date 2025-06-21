import { createAsyncThunk } from "@reduxjs/toolkit";
export const renamePlan = createAsyncThunk(
    'skills/renamePlan',
    async (args: {
        planId: string,
        newName: string,
        characterName: string
    }) => {
        return args;
    }
);