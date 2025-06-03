import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {DraggableCard, type Card} from './DraggableCard';
import './DraggableCard.scss';
import {
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { CardListContext } from './CardTypes';

export interface Card {
  id: string;
  text: string;
}

const CardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: '1', text: 'Write a cool JS library' },
    { id: '2', text: 'Make it generic enough' },
    { id: '3', text: 'Write README' },
    { id: '4', text: 'Create some examples' },
    { id: '5', text: 'Promote it on Twitter' },
    { id: '6', text: '???' },
    { id: '7', text: 'PROFIT' },
  ]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [instanceId] = useState(() => Symbol('card-list-instance'));
  
  const cardRegistry = useRef(new Map<string, HTMLElement>()).current;
  
  const registerCard = useCallback((id: string, element: HTMLElement) => {
    cardRegistry.set(id, element);
    return () => {
      cardRegistry.delete(id);
    };
  }, [cardRegistry]);
  
  const reorderCard = useCallback((startIndex: number, endIndex: number) => {
    console.log(`CardList reorderCard: ${startIndex} -> ${endIndex}`);
    
    setCards(currentCards => {
      // Make sure indices are within bounds
      if (startIndex < 0 || startIndex >= currentCards.length || 
          endIndex < 0 || endIndex > currentCards.length) {
        console.error(`Invalid indices: ${startIndex} -> ${endIndex}, length: ${currentCards.length}`);
        return currentCards;
      }
      
      // Create a new array with the reordered items
      const result = Array.from(currentCards);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return result;
    });
  }, []);
  
  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => {
        return source.data.instanceId === instanceId;
      },
      onDrop: ({ location, source }) => {
        const target = location.current.dropTargets[0];
        if (!target) {
			console.warn("No target drop target found");	
			return
		};
        
        const sourceIndex = source.data.index;
        const targetIndex = target.data.index;

		console.log("onDrop", sourceIndex, targetIndex)

        
        if (sourceIndex === targetIndex) return;
        
        const edge = extractClosestEdge(target.data);
        const finalIndex = getReorderDestinationIndex({
          startIndex: sourceIndex,
          indexOfTarget: targetIndex,
          closestEdgeOfTarget: edge,
          axis: 'vertical',
        });
        
        reorderCard(sourceIndex, finalIndex);
      },
    });
  }, [instanceId, reorderCard]);
  
  const contextValue = useMemo(() => ({
    registerCard,
    reorderCard,
    instanceId,
  }), [registerCard, reorderCard, instanceId]);
  
  return (
    <CardListContext.Provider value={contextValue}>
      <div ref={containerRef} className="card-list">
        <h3>Draggable Cards</h3>
        {cards.map((card, index) => (
          <DraggableCard 
            key={card.id} 
            card={card} 
            index={index} 
          />
        ))}
      </div>
    </CardListContext.Provider>
  );
};

export default CardList;