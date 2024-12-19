import React from "react";
import { Link } from "react-router-dom";

function ShoppingCard({ item }) { 
    return (
        <div className="shopping-card">
            <img src={item.imageUrl} alt={item.title} className="shopping-card-image" /> {/* Display the image */}
            <h2>{item.title}</h2>
            <p>Price: {item.price}</p>
            <Link to={`/item/${item.category}/${item.id}`}>View Details</Link> {/* Link to item details with type and id */}
        </div>
    );
}

export default ShoppingCard;
