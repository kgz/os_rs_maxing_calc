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

	const BoneShardData: ItemMapping = {
		examine: "A shard of bone.",
        id: 29381,
        members: false,
        lowalch: 50,
        limit: 0,
		value: 0,
        highalch: 0,
        icon: "Blessed_bone_shards_detail.png",
        name: "Bone shard",
        imageSrc: "https://oldschool.runescape.wiki/images/thumb/Blessed_bone_shards_detail.png/150px-Blessed_bone_shards_detail.png?1e664"
	}
    
    // Check if coins already exist in the response
    const coinsExists = mappingData.some(item => item.id === 995);
    
    // Only add if it doesn't already exist
    if (!coinsExists) {
      mappingData.push(coinsItem);
    }

	// Add Bone Shard manually since it's not in the API response
	mappingData.push(BoneShardData);
    
    
    return mappingData;
  }
);