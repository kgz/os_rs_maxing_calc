import React, {
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import {
	attachClosestEdge,
	type Edge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
	type ElementDropTargetEventBasePayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { Box, Grid, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import type { TrainingMethod } from '../store/skillsSlice';
import { isItemData, itemKey, useListContext, type ItemData, type ItemPosition } from './CardTypes';

const listItemContainerStyles = xcss({
	position: 'relative',
	// @ts-expect-error TS-ignore
	backgroundColor: 'var(--osrs-brown)',
	borderWidth: 'border.width.0',
	borderBottomWidth: token('border.width', '1px'),
	borderStyle: 'solid',
	borderColor: 'color.border',
	':last-of-type': {
		borderWidth: 'border.width.0',
	},
});

const listItemStyles = xcss({
	position: 'relative',
	padding: 'space.100',
});

const listItemDisabledStyles = xcss({ opacity: 0.4 });

type DraggableState =
	| { type: 'idle' }
	| { type: 'preview'; container: HTMLElement }
	| { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };


const itemLabelStyles = xcss({
	flexGrow: 1,
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
});

const levelInputContainerStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	gap: 'space.050',
	// @ts-expect-error TS-ignore
	backgroundColor: 'var(--osrs-brown)',
	padding: 'space.050',
	borderRadius: 'border.radius.100',
	border: `1px solid var(--osrs-gold)`,
});

const levelLabelStyle = {
	fontSize: '0.85rem',
	fontWeight: 500,
	color: 'var(--osrs-gold)',
	marginRight: '4px',
};

const levelInputStyle = {
	width: '50px',
	border: 'none',
	backgroundColor: 'transparent',
	textAlign: 'center',
	color: '#e0d0a0',
	fontSize: '0.9rem',
	padding: '2px',
} satisfies React.CSSProperties;

function DropDownContent({ position, index }: { position: ItemPosition; index: number }) {
	const { reorderItem, getListLength } = useListContext();

	const isMoveUpDisabled = position === 'first' || position === 'only';
	const isMoveDownDisabled = position === 'last' || position === 'only';

	const moveToTop = useCallback(() => {
		reorderItem({
			startIndex: index,
			indexOfTarget: 0,
			closestEdgeOfTarget: null,
		});
	}, [index, reorderItem]);

	const moveUp = useCallback(() => {
		reorderItem({
			startIndex: index,
			indexOfTarget: index - 1,
			closestEdgeOfTarget: null,
		});
	}, [index, reorderItem]);

	const moveDown = useCallback(() => {
		reorderItem({
			startIndex: index,
			indexOfTarget: index + 1,
			closestEdgeOfTarget: null,
		});
	}, [index, reorderItem]);

	const moveToBottom = useCallback(() => {
		reorderItem({
			startIndex: index,
			indexOfTarget: getListLength() - 1,
			closestEdgeOfTarget: null,
		});
	}, [index, getListLength, reorderItem]);

	return (
		<DropdownItemGroup>
			<DropdownItem onClick={moveToTop} isDisabled={isMoveUpDisabled}>
				Move to top
			</DropdownItem>
			<DropdownItem onClick={moveUp} isDisabled={isMoveUpDisabled}>
				Move up
			</DropdownItem>
			<DropdownItem onClick={moveDown} isDisabled={isMoveDownDisabled}>
				Move down
			</DropdownItem>
			<DropdownItem onClick={moveToBottom} isDisabled={isMoveDownDisabled}>
				Move to bottom
			</DropdownItem>
		</DropdownItemGroup>
	);
}

function getItemData({
	item,
	index,
	instanceId,
}: {
	item: TrainingMethod;
	index: number;
	instanceId: symbol;
}): ItemData {
	return {
		[itemKey]: true,
		item,
		index,
		instanceId,
	};
}

export const ListItem = ({
	item,
	index,
	position,
	onStartLevelChange,
	onEndLevelChange,
}: {
	item: TrainingMethod;
	index: number;
	position: ItemPosition;
	onStartLevelChange: (itemId: string, level: number) => void;
	onEndLevelChange: (itemId: string, level: number) => void;
}) => {
	const { registerItem, instanceId } = useListContext();

	const ref = useRef<HTMLDivElement>(null);
	const dragHandleRef = useRef<HTMLButtonElement>(null);

	const [draggableState, setDraggableState] = useState<DraggableState>(idleState);
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
	const [startLevel, setStartLevel] = useState<number>(item.startLevel || 1); // Default to 1
	const [endLevel, setEndLevel] = useState<number>(item.endLevel || 99); // Default to 99

	useEffect(() => {
		const element = ref.current;
		const dragHandle = dragHandleRef.current;
		invariant(element);
		invariant(dragHandle);

		const data = getItemData({ item, index, instanceId });

		function onChange({ source, self }: ElementDropTargetEventBasePayload) {
			const isSource = source.element === dragHandle;
			if (isSource) {
				setClosestEdge(null);
				return;
			}

			const closestEdge = extractClosestEdge(self.data);

			const sourceIndex = source.data.index;
			invariant(typeof sourceIndex === 'number');

			const isItemBeforeSource = index === sourceIndex - 1;
			const isItemAfterSource = index === sourceIndex + 1;

			const isDropIndicatorHidden =
				(isItemBeforeSource && closestEdge === 'bottom') ||
				(isItemAfterSource && closestEdge === 'top');

			if (isDropIndicatorHidden) {
				setClosestEdge(null);
				return;
			}

			setClosestEdge(closestEdge);
		}

		return combine(
			registerItem({ itemId: item.id, element }),
			draggable({
				element: dragHandle,
				getInitialData: () => data,
				onGenerateDragPreview({ nativeSetDragImage }) {
					setCustomNativeDragPreview({
						nativeSetDragImage,
						getOffset: pointerOutsideOfPreview({
							x: token('space.200', '16px'),
							y: token('space.100', '8px'),
						}),
						render({ container }) {
							setDraggableState({ type: 'preview', container });

							return () => setDraggableState(draggingState);
						},
					});
				},
				onDragStart() {
					setDraggableState(draggingState);
				},
				onDrop() {
					setDraggableState(idleState);
				},
			}),
			dropTargetForElements({
				element,
				canDrop({ source }) {
					return isItemData(source.data) && source.data.instanceId === instanceId;
				},
				getData({ input }) {
					return attachClosestEdge(data, {
						element,
						input,
						allowedEdges: ['top', 'bottom'],
					});
				},
				onDragEnter: onChange,
				onDrag: onChange,
				onDragLeave() {
					setClosestEdge(null);
				},
				onDrop() {
					setClosestEdge(null);
				},
			}),
		);
	}, [instanceId, item, index, registerItem]);

	const handleStartLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newLevel = parseInt(e.target.value, 10);
		setStartLevel(newLevel);
		onStartLevelChange(item.id, newLevel);
	};

	const handleEndLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newLevel = parseInt(e.target.value, 10);
		setEndLevel(newLevel);
		onEndLevelChange(item.id, newLevel);
	};

	return (
		<Fragment>
			<Box ref={ref} xcss={listItemContainerStyles}>
				<Grid
					alignItems="center"
					columnGap="space.050"
					templateColumns="auto 1fr auto"
					xcss={[
						listItemStyles,
						/**
						 * We are applying the disabled effect to the inner element so that
						 * the border and drop indicator are not affected.
						 */
						draggableState.type === 'dragging' && listItemDisabledStyles,
					]}
				>
					<DropdownMenu
						trigger={({ triggerRef, ...triggerProps }) => (
							<DragHandleButton
								color='white'
								style={{ 'color': 'white' }}
								ref={mergeRefs([dragHandleRef, triggerRef])}
								{...triggerProps}
								label={`Reorder ${item.name}`}
							/>
						)}
					>
						<DropdownItemGroup>
							<DropDownContent position={position} index={index} />
						</DropdownItemGroup>
					</DropdownMenu>
					<Box xcss={itemLabelStyles}>{item.name}</Box>
					<Inline alignBlock="center" space="space.100">
						<Box xcss={levelInputContainerStyles}>
							<label htmlFor={`start-level-${item.id}`} style={levelLabelStyle}>
								Start Level:
							</label>
							<input
								id={`start-level-${item.id}`}
								type="number"
								value={startLevel}
								onChange={handleStartLevelChange}
								min="1"
								max="98"
								style={levelInputStyle}
							/>
						</Box>
						<Box xcss={levelInputContainerStyles}>
							<label htmlFor={`end-level-${item.id}`} style={levelLabelStyle}>
								End Level:
							</label>
							<input
								id={`end-level-${item.id}`}
								type="number"
								value={endLevel}
								onChange={handleEndLevelChange}
								min="2"
								max="99"
								style={levelInputStyle}
							/>
						</Box>
					</Inline>
				</Grid>
				{closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
			</Box>
			{draggableState.type === 'preview' &&
				ReactDOM.createPortal(
					// <Box xcss={listItemPreviewStyles}>{item.id}</Box>,
					<Grid
						alignItems="center"
						columnGap="space.050"
						templateColumns="auto 1fr auto"
						xcss={[
							listItemStyles,
							/**
							 * We are applying the disabled effect to the inner element so that
							 * the border and drop indicator are not affected.
							 */

						]}
					>
						<DropdownMenu
							trigger={({ triggerRef, ...triggerProps }) => (
								<DragHandleButton
									color='white'
									style={{ 'color': 'white' }}
									ref={mergeRefs([dragHandleRef, triggerRef])}
									{...triggerProps}
									label={`Reorder ${item.name}`}
								/>
							)}
						>
							<DropdownItemGroup>
								<DropDownContent position={position} index={index} />
							</DropdownItemGroup>
						</DropdownMenu>
						<Box xcss={itemLabelStyles}>{item.name}</Box>
						<Inline alignBlock="center" space="space.100">
							<Box xcss={levelInputContainerStyles}>
								<label htmlFor={`start-level-${item.id}`} style={levelLabelStyle}>
									Start Level:
								</label>
								<input
									id={`start-level-${item.id}`}
									type="number"
									value={startLevel}
									onChange={handleStartLevelChange}
									min="1"
									max="98"
									style={levelInputStyle}
								/>
							</Box>
							<Box xcss={levelInputContainerStyles}>
								<label htmlFor={`end-level-${item.id}`} style={levelLabelStyle}>
									End Level:
								</label>
								<input
									id={`end-level-${item.id}`}
									type="number"
									value={endLevel}
									onChange={handleEndLevelChange}
									min="2"
									max="99"
									style={levelInputStyle}
								/>
							</Box>
						</Inline>
					</Grid>,
					draggableState.container,
				)}
		</Fragment>
	);
};