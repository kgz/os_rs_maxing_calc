import { createContext } from "react";

export type CardListContextValue = {
  registerCard: (id: string, element: HTMLElement) => () => void;
  reorderCard: (startIndex: number, endIndex: number) => void;
  instanceId: symbol;
};

export  const CardListContext = createContext<CardListContextValue | null>(null);



export interface Card {
  id: string;
  text: string;
}
