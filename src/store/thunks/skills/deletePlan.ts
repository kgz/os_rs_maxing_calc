import { createAsyncThunk } from "@reduxjs/toolkit";

export const deletePlan = createAsyncThunk(
  'skills/deletePlan',
  async (args: {
    planId: string,
    characterName: string
  }) => {
    return args;
  }
);
