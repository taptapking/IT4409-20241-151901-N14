import ShoppingCard from './ShoppingCard';


function CardList({ searchQuery,mockItems, }) {
    const filteredItems = mockItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
