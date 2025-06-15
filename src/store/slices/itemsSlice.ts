import { createSlice } from '@reduxjs/toolkit';
import { fetchItemMapping } from '../thunks/items/fetchItemMapping';
import { fetchLatestPrices } from '../thunks/items/fetchLatestPrices';
import type { ItemMapping, ItemMappingRecord } from '../../types/itemMapping';
import type { RootState } from '../store';

// Update the ItemsState interface to include prices
interface ItemsState {
  mapping: ItemMappingRecord;
  prices: {
    [itemId: string]: {
      high: number;
      highTime: number;
      low: number;
      lowTime: number;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  mapping: {},
  prices: {},
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemMapping.fulfilled, (state, action) => {
        state.loading = false;
        
        // Convert array to record for easier lookup by ID
        const mappingRecord: ItemMappingRecord = {};
        action.payload.forEach((item: ItemMapping) => {
          mappingRecord[item.id] = item;
        });
        
        state.mapping = mappingRecord;
      })
      .addCase(fetchItemMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch item mapping';
      })
      // Add cases for fetchLatestPrices
      .addCase(fetchLatestPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(fetchLatestPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch latest prices';
      });
  },
});

// Selector to get an item by ID
export const selectItemById = (state: RootState, itemId: number): ItemMapping | undefined => 
  state.items.mapping[itemId];

// Selector to get all items
export const selectAllItems = (state: RootState): ItemMappingRecord => 
  state.items.mapping;

export const selectAllPrices = (state: RootState): { [itemId: string]: { high: number; low: number } } => 
	state.items.prices;


export default itemsSlice.reducer;