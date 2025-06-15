import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

interface PriceData {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
}

interface LatestPricesResponse {
  data: {
    [itemId: string]: PriceData;
  };
}

export const fetchLatestPrices = createAsyncThunk(
  'items/fetchLatestPrices',
  async () => {
    const response = await axios.get<LatestPricesResponse>('https://prices.runescape.wiki/api/v1/osrs/latest');
    
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch latest price data');
    }
    return response.data.data;
  }
);

export const getItemPrice = (priceData: PriceData): number => {
  return (priceData.high + priceData.low) / 2;
};