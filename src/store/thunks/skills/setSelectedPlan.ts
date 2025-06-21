import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Plans } from "../../../plans/plans";

type TPlans = keyof typeof Plans;

// type T = keyof typeof Plans[TPlans];

export const setSelectedPlan = createAsyncThunk(
	'skills/setSelectedPlan',
	async (args: {skill: TPlans, plan: string, characterName:string}) => {
		return args;
	}
);