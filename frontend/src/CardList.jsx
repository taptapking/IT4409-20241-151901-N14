// CardList.jsx
import React from 'react';
import ShoppingCard from './ShoppingCard';
import mockItems from './data/mockItems';

function CardList() {
    return (
        <div className="card-list">
            {mockItems.map(item => (
                <ShoppingCard key={item.id} item={item} /> 
            ))}
        </div>
    );
}

export default CardList;
