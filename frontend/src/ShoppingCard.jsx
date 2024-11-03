// ShoppingCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function ShoppingCard({ item }) { 
    return (
        <div className="shopping-card">
            <h2>{item.name}</h2>
            <p>Price: {item.price}</p>
            <Link to={`/item/${item.id}`}>View Details</Link> {/* Link to item details */}
        </div>
    );
}

export default ShoppingCard;
