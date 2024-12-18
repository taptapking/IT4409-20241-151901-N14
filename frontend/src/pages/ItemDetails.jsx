import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API_URL from "../config/apiConfig"; 

function ItemDetails({ addToCart }) {
    const { category, id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from API
        const fetchItemDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/media/${category}/${id}`);
                if (!response.ok) {
                    throw new Error('Item not found');
                }
                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [category, id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const renderItemDetails = () => {
        switch (category) {
            case 'Book':
                return (
                    <div>
                        {/* Specific Book Details */}
                        <h3>Item Details</h3>
                        <p>Author: {item.specificItem?.author}</p>
                        <p>Publisher: {item.specificItem?.publisher}</p>
                        <p>Publish Date: {new Date(item.specificItem?.publish_date).toLocaleDateString()}</p>
                        <p>Number of Pages: {item.specificItem?.number_of_page}</p>
                        <p>Book Category: {item.specificItem?.book_category}</p>
                        <p>Cover Type: {item.specificItem?.cover_type}</p>
                        <p>Language: {item.specificItem?.language}</p>
                    </div>
                );
            case 'CD':
                return (
                    <div>
                        {/* Specific CD Details */}
                        <h3>Item Details</h3>
                        <p>Artist: {item.specificItem?.artist}</p>
                        <p>Music Type: {item.specificItem?.music_type}</p>
                        <p>Record Label: {item.specificItem?.record_label}</p>
                        <p>Category: {item.specificItem?.category_cd}</p>
                        <p>Release Date: {new Date(item.specificItem?.release_date).toLocaleDateString()}</p>
                    </div>
                );
            case 'DVD':
                return (
                    <div>
                        {/* Specific DVD Details */}
                        <h3>Item Details</h3>
                        <p>Studio: {item.specificItem?.studio}</p>
                        <p>Disc Type: {item.specificItem?.disc_type}</p>
                        <p>Subtitle: {item.specificItem?.subtitle}</p>
                        <p>Language: {item.specificItem?.language}</p>
                        <p>Runtime: {item.specificItem?.runtime}</p>
                        <p>Director: {item.specificItem?.director}</p>
                        <p>Release Date: {new Date(item.specificItem?.release_date).toLocaleDateString()}</p>
                        <p>Category: {item.specificItem?.dvd_category}</p>
                    </div>
                );
            default:
                return <div>Item type not supported</div>;
        }
    };

    return (
        <div className= "w-full bg-gray-600 p-6">
        <div className="w-full bg-white shadow rounded-lg p-6 flex gap-6">
    <div className="w-[250px] relative flex flex-col">
        <img
            src={item.mediaItem?.imageUrl}
            alt={item.mediaItem?.title}
            width={250}
            height={250}
            className="object-cover rounded-md"
        />
    </div>
    <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start">
            <h2 className="text-lg font-title mb-2">{item.mediaItem?.title}</h2>
        </div>
        <div>
            <p>Category: {item.mediaItem?.category}</p>
            <p>Price: ${item.mediaItem?.price}</p>
            <p>Weight: {item.mediaItem?.weight} kg</p>
            <p>Rush Delivery: {item.mediaItem?.rushDelivery ? "Yes" : "No"}</p>
        </div>
        <div className="mt-6">
            <button
                onClick={() => addToCart(item.mediaItem)}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
                Thêm Vào Giỏ Hàng
            </button>
        </div>
    </div>
</div>
        <div className="w-full bg-white shadow rounded-lg p-6 flex gap-6 mt-6">
            {/* Specific item details based on category */}
                <div className="mt-6">
                    {renderItemDetails()}
                </div>

        </div>
        </div>
    );
}

export default ItemDetails;
