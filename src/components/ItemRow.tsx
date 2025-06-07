import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import {
	type Edge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import {
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { Stack, xcss } from '@atlaskit/primitives';
import type { TrainingMethod } from '../store/slices/skillsSlice';
import { isItemData, ListContext, type ItemEntry, type ItemPosition, type ListContextValue } from './CardTypes';
import { ListItem } from './CardList';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useParams } from 'react-router-dom';




function getItemPosition({ index, items }: { index: number; items: TrainingMethod[] }): ItemPosition {
	if (items.length === 1) {
		return 'only';
	}

	if (index === 0) {
		return 'first';
	}

	if (index === items.length - 1) {
		return 'last';
	}

	return 'middle';
}






const containerStyles = xcss({
	// maxWidth: '400px',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
});

function getItemRegistry() {
	const registry = new Map<string, HTMLElement>();

	function register({ itemId, element }: ItemEntry) {
		registry.set(itemId, element);

		return function unregister() {
			registry.delete(itemId);
		};
	}

	function getElement(itemId: string): HTMLElement | null {
		return registry.get(itemId) ?? null;
	}

	return { register, getElement };
}

type ListState = {
	items: TrainingMethod[];
	lastCardMoved: {
		item: TrainingMethod;
		previousIndex: number;
		currentIndex: number;
		numberOfItems: number;
	} | null;
};

export function ItemRow() {
	const [{ items, lastCardMoved }, setListState] = useState<ListState>({
		items: [],
		lastCardMoved: null,
	});
	const [registry] = useState(getItemRegistry);
	const { skillId } = useParams<{ skillId: string }>();

	// Isolated instances of this component from one another
	const [instanceId] = useState(() => Symbol('instance-id'));

	const { trainingMethods } = useAppSelector((state) => state.skills);

	const {level: currentLevel} = useAppSelector((state) => state.skills.skills.find((s) => s.id === skillId));

	useEffect(() => {
		if (!skillId) return 
		setListState((listState) => ({
			items: trainingMethods[skillId].filter((method) => {
				if (method.endLevel < currentLevel) {
					return false;
                }
				return true;
			}).map((method) => {
				return {
					...method,
					startLevel: Math.max(method.startLevel, currentLevel),
				}
			}),
            lastCardMoved: null,
        }));
	}, [trainingMethods, skillId, currentLevel])

	const reorderItem = useCallback(
		({
			startIndex,
			indexOfTarget,
			closestEdgeOfTarget,
		}: {
			startIndex: number;
			indexOfTarget: number;
			closestEdgeOfTarget: Edge | null;
		}) => {
			const finishIndex = getReorderDestinationIndex({
				startIndex,
				closestEdgeOfTarget,
				indexOfTarget,
				axis: 'vertical',
			});

			if (finishIndex === startIndex) {
				// If there would be no change, we skip the update
				return;
			}

			setListState((listState) => {
				const item = listState.items[startIndex];

				return {
					items: reorder({
						list: listState.items,
						startIndex,
						finishIndex,
					}),
					lastCardMoved: {
						item,
						previousIndex: startIndex,
						currentIndex: finishIndex,
						numberOfItems: listState.items.length,
					},
				};
			});
		},
		[],
	);

	useEffect(() => {
		return monitorForElements({
			canMonitor({ source }) {
				return isItemData(source.data) && source.data.instanceId === instanceId;
			},
			onDrop({ location, source }) {
				const target = location.current.dropTargets[0];
				if (!target) {
					return;
				}

				const sourceData = source.data;
				const targetData = target.data;
				if (!isItemData(sourceData) || !isItemData(targetData)) {
					return;
				}

				const indexOfTarget = items.findIndex((item) => item.id === targetData.item.id);
				if (indexOfTarget < 0) {
					return;
				}

				const closestEdgeOfTarget = extractClosestEdge(targetData);

				reorderItem({
					startIndex: sourceData.index,
					indexOfTarget,
					closestEdgeOfTarget,
				});
			},
		});
	}, [instanceId, items, reorderItem]);

	// once a drag is finished, we have some post drop actions to take
	useEffect(() => {
		if (lastCardMoved === null) {
			return;
		}

		const { item, previousIndex, currentIndex, numberOfItems } = lastCardMoved;
		const element = registry.getElement(item.id);
		if (element) {
			triggerPostMoveFlash(element);
		}

		liveRegion.announce(
			`You've moved ${item.id} from position ${
				previousIndex + 1
			} to position ${currentIndex + 1} of ${numberOfItems}.`,
		);
	}, [lastCardMoved, registry]);

	// cleanup the live region when this component is finished
	useEffect(() => {
		return function cleanup() {
			liveRegion.cleanup();
		};
	}, []);

	const getListLength = useCallback(() => items.length, [items.length]);

	const contextValue: ListContextValue = useMemo(() => {
		return {
			registerItem: registry.register,
			reorderItem,
			instanceId,
			getListLength,
		};
	}, [registry.register, reorderItem, instanceId, getListLength]);

	const dispatch = useAppDispatch();

	

	const handleStartLevelChange = useCallback(
        (methodId: string, newStartLevel: number) => {
			const methodIndex = trainingMethods[skillId].findIndex((m) => m.id === methodId);
			if (methodIndex >= 0) {
                const newMethods = trainingMethods[skillId].slice();
                newMethods[methodIndex] = {...newMethods[methodIndex], startLevel: newStartLevel };
                dispatch(updateTrainingMethods({ skillId, trainingMethods: newMethods }));
            }
			},
        [dispatch, skillId, trainingMethods]
	);

	return (
		<ListContext.Provider value={contextValue}>
			<Stack xcss={containerStyles}>
				{/*
          It is not expensive for us to pass `index` to items for this example,
          as when reordering, only two items index will ever change.

          If insertion or removal where allowed, it would be worth making
          `index` a getter (eg `getIndex()`) to avoid re-rendering many items
        */}
				{items.map((item, index) => (
					<ListItem
						key={item.id}
						item={item}
						index={index}
						position={getItemPosition({ index, items })}
						onStartLevelChange={handleStartLevelChange}
					/>
				))}
			</Stack>
		</ListContext.Provider>
	);
}
