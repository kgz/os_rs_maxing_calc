import { useSelector } from 'react-redux';
import { selectAllItems, selectAllPrices } from '../store/slices/itemsSlice';
import type { ItemMapping } from '../types/itemMapping';

export const useItems = () => {
  const allItems = useSelector(selectAllItems);
  const allPrices = useSelector(selectAllPrices);
  
  const getItemById = (id: number): ItemMapping | undefined => {
    return allItems[id];
  };
  
  const getItemIconUrl = (id: number): string | undefined => {
    const item = allItems[id];
    if (!item) return undefined;
    
    // Construct the URL for the item icon
    // You might need to adjust this based on your requirements
    const url = item.icon.replaceAll(/\s/g, '_');

    return `https://oldschool.runescape.wiki/images/thumb/${url}/180px-${url}?9e894`;
  };
  
  /**
   * Get the current price of an item
   * @param id The item ID
   * @param type 'buy' (uses low price), 'sell' (uses high price), or 'average' (uses average of high and low)
   * @returns The price of the item or undefined if not found
   */
  const getItemPrice = (id: number, type: 'buy' | 'sell' | 'average' = 'average'): number | undefined => {
    // Convert id to string for accessing the prices object
    const itemId = id.toString();
    
    // Check if we have price data for this item
    if (!allPrices || !allPrices[itemId]) {
      // Fall back to the item's base value if available
      return allItems[id]?.value;
    }
    
    const priceData = allPrices[itemId];
		// Use the average of high and low prices
	const validHigh = priceData.high > 0 ? priceData.high : 0;
	const validLow = priceData.low > 0 ? priceData.low : 0;

    // Handle different price types
    switch (type) {
      case 'buy':
        // When buying, use the low price (what people are selling for)
        return priceData.low > 0 ? priceData.low : priceData.high;
      case 'sell':
        // When selling, use the high price (what people are buying for)
        return priceData.high > 0 ? priceData.high : priceData.low;
      case 'average':
      default:
  
        
        // If only one price is available, use that
        if (validHigh === 0) return validLow;
        if (validLow === 0) return validHigh;
        
        // Otherwise return the average
        return Math.round((validHigh + validLow) / 2);
    }
  };
  
  return {
    allItems,
    allPrices,
    getItemById,
    getItemIconUrl,
    getItemPrice
  };
};