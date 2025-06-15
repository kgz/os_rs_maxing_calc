import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import type { ItemMapping } from "../../../types/itemMapping";

export const fetchItemMapping = createAsyncThunk(
  'items/fetchItemMapping',
  async () => {
    const response = await axios.get<ItemMapping[]>('https://prices.runescape.wiki/api/v1/osrs/mapping');
    
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch item mapping data');
    }
    
    return response.data;
  }
);