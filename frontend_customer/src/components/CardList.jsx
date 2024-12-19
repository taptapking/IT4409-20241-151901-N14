import ShoppingCard from './ShoppingCard';


function CardList({ searchQuery,mediaItems, }) {
    const filteredItems = mediaItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="card-list">
            {filteredItems.map(item => (
                <ShoppingCard key={item.id} item={item} /> 
            ))}
        </div>
    );
}

export default CardList;
