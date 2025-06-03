import type { TrainingMethod } from "../store/skillsSlice";

export const trainingMethods: Record<string, TrainingMethod[]> = {
  woodcutting: [
    {id: '1', name: 'Regular trees', levelReq: 1, xpPerHour: 7000, intensity: 'Low', startLevel: 1, endLevel: 15 },
    {id: '2', name: 'Oak trees', levelReq: 15, xpPerHour: 15000, intensity: 'Low', startLevel: 15, endLevel: 30 },
    {id: '3', name: 'Willow trees', levelReq: 30, xpPerHour: 35000, intensity: 'Medium', startLevel: 30, endLevel: 35 },
    {id: '4', name: 'Teak trees', levelReq: 35, xpPerHour: 65000, intensity: 'High', startLevel: 35, endLevel: 45 },
    {id: '5', name: 'Maple trees', levelReq: 45, xpPerHour: 45000, intensity: 'Medium', startLevel: 45, endLevel: 60 },
    {id: '6', name: 'Yew trees', levelReq: 60, xpPerHour: 50000, intensity: 'Low', startLevel: 60, endLevel: 90 },
    {id: '7', name: 'Redwood trees', levelReq: 90, xpPerHour: 70000, intensity: 'Low', startLevel: 90, endLevel: 99 },
  ],
  // Add more skills and their training methods here
};