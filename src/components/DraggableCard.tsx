import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { CardListContext } from "./CardTypes";

const useCardListContext = () => {
  const context = useContext(CardListContext);
  if (!context) {
    throw new Error('useCardListContext must be used within a CardListProvider');
  }
  return context;
};

export const DraggableCard: React.FC<{
  card: Card;
  index: number;
}> = ({ card, index }) => {
  const { registerCard, instanceId, reorderCard } = useCardListContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    
    // Create a data object that will be consistent for both drag and drop
    const itemData = {
      id: card.id,
      index,
      instanceId,
      type: 'card',
    };
    
    const cleanup = combine(
      registerCard(card.id, element),
      draggable({
        element,
        getInitialData: () => itemData,
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.instanceId === instanceId && source.data.type === 'card';
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            itemData,
            {
              element,
              input,
              allowedEdges: ['top', 'bottom'],
            }
          );
        },
        onDragEnter: ({ source, self }) => {
          if (source.data.id === card.id) {
            setClosestEdge(null);
            return;
          }
          
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDrag: ({ source, self }) => {
          if (source.data.id === card.id) {
            setClosestEdge(null);
            return;
          }
          
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: ({ source }) => {
          // Clear the visual indicator
          setClosestEdge(null);
          
          // Only proceed if we have valid source data
          if (source.data.index === undefined) {
            console.error('Invalid source index:', source.data);
            return;
          }
          
          const sourceIndex = source.data.index;
          const targetIndex = index;
          
          // Don't reorder if dropped on itself
          if (sourceIndex === targetIndex) {
            return;
          }
          
          // Simple reordering logic based on the edge
          let finalIndex = targetIndex;
          if (closestEdge === 'bottom') {
            finalIndex = targetIndex + 1;
          }
          
          console.log(`Reordering from ${sourceIndex} to ${finalIndex} (edge: ${closestEdge})`);
          reorderCard(sourceIndex, finalIndex);
        },
      })
    );
    
    return cleanup;
  }, [card.id, index, registerCard, instanceId, reorderCard, closestEdge]);
  
  return (
    <div 
      ref={cardRef} 
      className="draggable-card"
      style={{
        position: 'relative',
        padding: '10px',
        margin: '5px 0',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{index}: {card.text}</span>
      <span style={{ color: '#888', fontSize: '0.8em' }}>ID: {card.id}</span>
      {closestEdge && (
        <div 
          className={`drop-indicator drop-indicator-${closestEdge}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#0052CC',
            [closestEdge === 'top' ? 'top' : 'bottom']: 0,
          }}
        />
      )}
    </div>
  );
};