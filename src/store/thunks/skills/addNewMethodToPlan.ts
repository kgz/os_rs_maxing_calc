import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Plans } from "../../../plans/plans";

type TSkill = keyof typeof Plans;


export const addNewMethodToPlan = createAsyncThunk(
	'skills/addNewMethodToPlan',
    async (args: {
		index: number,
		planId: string,
		skill: TSkill,
	}) => {
        return args
    }
);