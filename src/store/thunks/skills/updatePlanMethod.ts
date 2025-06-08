import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Method } from "../../../types/method";

export const updatePlanMethod = createAsyncThunk(
	'skills/updatePlanMethod',
    async (args: {
        planId: string,
        methodIndex: number,
        method: Method,
    }) => {
        return args;
    }
);