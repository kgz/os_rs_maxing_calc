import { createSlice } from '@reduxjs/toolkit';
import { fetchItemMapping } from '../thunks/items/fetchItemMapping';
import type { ItemMapping, ItemMappingRecord } from '../../types/itemMapping';
import type { RootState } from '../store';

interface ItemsState {
  mapping: ItemMappingRecord;
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  mapping: {},
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
      });
  },
});

// Selector to get an item by ID
export const selectItemById = (state: RootState, itemId: number): ItemMapping | undefined => 
  state.items.mapping[itemId];

// Selector to get all items
export const selectAllItems = (state: RootState): ItemMappingRecord => 
  state.items.mapping;

export default itemsSlice.reducer;