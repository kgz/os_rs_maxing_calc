import { useSelector } from 'react-redux';
import { selectAllItems } from '../store/slices/itemsSlice';
import type { ItemMapping } from '../types/itemMapping';

export const useItems = () => {
  const allItems = useSelector(selectAllItems);
  
  const getItemById = (id: number): ItemMapping | undefined => {
    return allItems[id];
  };
  
  const getItemIconUrl = (id: number): string | undefined => {
    const item = allItems[id];
	console.log('getItemIconUrl', item, id, allItems);
    if (!item) return undefined;
    
    // Construct the URL for the item icon
    // You might need to adjust this based on your requirements
	const url = item.icon.replaceAll(/\s/g, '_');

    return `https://oldschool.runescape.wiki/images/thumb/${url}/180px-${url}?9e894`;
  };
  
  return {
    allItems,
    getItemById,
    getItemIconUrl
  };
};