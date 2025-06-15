export interface ItemMapping {
  examine: string;
  id: number;
  members: boolean;
  lowalch: number;
  limit: number;
  value: number;
  highalch: number;
  icon: string;
  name: string;
  imageSrc?: string; // Optional property for custom image sources
}

export type ItemMappingRecord = Record<number, ItemMapping>;