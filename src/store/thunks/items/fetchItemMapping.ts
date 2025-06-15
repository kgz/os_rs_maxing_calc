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
    
    const mappingData = response.data;
    
    // Add Coins item manually since it's not in the API response
    const coinsItem: ItemMapping = {
      examine: "Lovely money!",
      id: 995,
      members: false,
      lowalch: 1,
      limit: 0, // No GE limit for coins
      value: 1,
      highalch: 1,
      icon: "Coins_250.png",
      name: "Coins",
      imageSrc: "https://oldschool.runescape.wiki/images/Coins_250.png?c2755"
    };
    
    // Check if coins already exist in the response
    const coinsExists = mappingData.some(item => item.id === 995);
    
    // Only add if it doesn't already exist
    if (!coinsExists) {
      mappingData.push(coinsItem);
    }
    
    return mappingData;
  }
);