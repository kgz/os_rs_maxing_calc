import React from 'react';
import { useItems } from '../hooks/useItems';

interface ItemDisplayProps {
  itemId: number;
}

const ItemDisplay: React.FC<ItemDisplayProps> = ({ itemId }) => {
  const { getItemById, getItemIconUrl } = useItems();
  const item = getItemById(itemId);
  
  if (!item) {
    return <div>Item not found</div>;
  }
  
  return (
    <div className="item-display">
      <img src={getItemIconUrl(itemId)} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.examine}</p>
      <div className="item-details">
        <p>Value: {item.value}</p>
        <p>High Alch: {item.highalch}</p>
        <p>Low Alch: {item.lowalch}</p>
        {item.members && <p className="members-item">Members Item</p>}
      </div>
    </div>
  );
};

export default ItemDisplay;