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
import Lozenge from '@atlaskit/lozenge';
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
import { Box, Grid, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import type { TrainingMethod } from '../store/skillsSlice';
import { isItemData, itemKey, useListContext, type ItemData, type ItemPosition } from './CardTypes';
import styles from './CardList.module.scss';

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

  const ref = useRef&lt;HTMLDivElement&gt;(null);
  const dragHandleRef = useRef&lt;HTMLButtonElement&gt;(null);

  const [draggableState, setDraggableState] = useState&lt;DraggableState&gt;(idleState);
  const [closestEdge, setClosestEdge] = useState&lt;Edge | null&gt;(null);
  const [startLevel, setStartLevel] = useState&lt;number&gt;(item.startLevel || 1);
  const [endLevel, setEndLevel] = useState&lt;number&gt;(item.endLevel || 99);

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
        (isItemBeforeSource &amp;&amp; closestEdge === 'bottom') ||
        (isItemAfterSource &amp;&amp; closestEdge === 'top');

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
        getInitialData: () =&gt; data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: token('space.200', '16px'),
              y: token('space.100', '8px'),
            }),
            render({ container }) {
              setDraggableState({ type: 'preview', container });

              return () =&gt; setDraggableState(draggingState);
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
          return isItemData(source.data) &amp;&amp; source.data.instanceId === instanceId;
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

  const handleStartLevelChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const newLevel = parseInt(e.target.value, 10);
    setStartLevel(newLevel);
    onStartLevelChange(item.id, newLevel);
  };

  const handleEndLevelChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const newLevel = parseInt(e.target.value, 10);
    setEndLevel(newLevel);
    onEndLevelChange(item.id, newLevel);
  };

  return (
    &lt;Fragment&gt;
      &lt;Box ref={ref} className={styles.listItemContainer}&gt;
        &lt;Grid
          alignItems="center"
          columnGap="space.050"
          templateColumns="auto 1fr auto"
          className={`${styles.listItem} ${draggableState.type === 'dragging' ? styles.listItemDisabled : ''}`}
        &gt;
          &lt;DropdownMenu
            trigger={({ triggerRef, ...triggerProps }) =&gt; (
              &lt;DragHandleButton
                ref={mergeRefs([dragHandleRef, triggerRef])}
                {...triggerProps}
                label={`Reorder ${item.name}`}
              /&gt;
            )}
          &gt;
            &lt;DropdownItemGroup&gt;
              &lt;DropDownContent position={position} index={index} /&gt;
            &lt;/DropdownItemGroup&gt;
          &lt;/DropdownMenu&gt;
          &lt;Box className={styles.itemLabel}&gt;{item.name}&lt;/Box&gt;
          &lt;Inline alignBlock="center" space="space.100"&gt;
            &lt;Box className={styles.levelInputContainer}&gt;
              &lt;label htmlFor={`start-level-${item.id}`} className={styles.levelLabel}&gt;
                Start Level:
              &lt;/label&gt;
              &lt;input 
                id={`start-level-${item.id}`}
                type="number" 
                value={startLevel} 
                onChange={handleStartLevelChange}
                min="1"
                max="98"
                className={styles.levelInput}
              /&gt;
            &lt;/Box&gt;
            &lt;Box className={styles.levelInputContainer}&gt;
              &lt;label htmlFor={`end-level-${item.id}`} className={styles.levelLabel}&gt;
                End Level:
              &lt;/label&gt;
              &lt;input 
                id={`end-level-${item.id}`}
                type="number" 
                value={endLevel} 
                onChange={handleEndLevelChange}
                min="2"
                max="99"
                className={styles.levelInput}
              /&gt;
            &lt;/Box&gt;
          &lt;/Inline&gt;
        &lt;/Grid&gt;
        {closestEdge &amp;&amp; &lt;DropIndicator edge={closestEdge} gap="1px" /&gt;}
      &lt;/Box&gt;
      {draggableState.type === 'preview' &amp;&amp;
        ReactDOM.createPortal(
          &lt;Box className={styles.listItemPreview}&gt;{item.name}&lt;/Box&gt;,
          draggableState.container,
        )}
    &lt;/Fragment&gt;
  );
};