import { useParams } from "react-router-dom";
import mockItems from "./data/mockItems"; 

function ItemDetails() {
    const { id } = useParams();
    const item = mockItems.find(item => item.id === parseInt(id)); 

    if (!item) {
        return <div>Item not found</div>; 
    }

    return (
        <div>
            <div>
                <img src="path_to_image" alt={item.name} /> 
            </div>
            <div>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>Price: {item.price}</p>
            </div>
        </div>
    );
}

export default ItemDetails;
