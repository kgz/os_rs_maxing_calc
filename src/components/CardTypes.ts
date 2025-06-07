import { createContext, useContext } from "react";
import type { TrainingMethod } from "../store/slices/skillsSlice";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
import invariant from 'tiny-invariant';

export type ItemPosition = 'first' | 'last' | 'middle' | 'only';

export type CleanupFn = () => void;

export type ItemEntry = { itemId: string; element: HTMLElement };

export type ListContextValue = {
	getListLength: () => number;
	registerItem: (entry: ItemEntry) => CleanupFn;
	reorderItem: (args: {
		startIndex: number;
		indexOfTarget: number;
		closestEdgeOfTarget: Edge | null;
	}) => void;
	instanceId: symbol;
};

export const ListContext = createContext<ListContextValue | null>(null);

export type Item = {
	id: string;
	label: string;
};

export const itemKey = Symbol('item');
export type ItemData = {
	[itemKey]: true;
	item: TrainingMethod;
	index: number;
	instanceId: symbol;
};



export const  useListContext = () => {
	const listContext = useContext(ListContext);
	invariant(listContext !== null);
	return listContext;
}



export function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
	return data[itemKey] === true;
}