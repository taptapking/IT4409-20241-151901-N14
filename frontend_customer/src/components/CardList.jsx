import React, { useState } from 'react';
import ShoppingCard from './ShoppingCard';

function CardList({ searchQuery, mediaItems }) {
    const [sortOrder, setSortOrder] = useState('nameAsc'); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredItems = mediaItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortOrder === 'priceAsc') {
            return a.price - b.price;
        } else if (sortOrder === 'priceDesc') {
            return b.price - a.price;
        } else if (sortOrder === 'nameAsc') {
            return a.title.localeCompare(b.title);
        } else if (sortOrder === 'nameDesc') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (e) => {
        const selectedSort = e.target.value;
        setSortOrder(selectedSort);
    };

    return (
        <div className="card-list-container">
            <div className="sort-options">
                <select 
                    onChange={handleSortChange} 
                    value={sortOrder}
                    className="sort-dropdown"
                >
                    <option value="nameAsc">Sort by Name (A to Z)</option>
                    <option value="nameDesc">Sort by Name (Z to A)</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                </select>
            </div>
            <div className="card-list">
                {currentItems.map((item) => (
                    <ShoppingCard key={item.id} item={item} />
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CardList;
