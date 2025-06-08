import { createAsyncThunk } from "@reduxjs/toolkit";

export  const removeMethodFromPlan = createAsyncThunk(
	'skills/removeMethodFromPlan', 
	async (args: {
		planId: string,
        methodIndex: number,
    }) => {
		return args;
	})