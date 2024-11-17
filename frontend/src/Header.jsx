import { Link } from "react-router-dom"; 

function Header({ cart, searchQuery, setSearchQuery } ) {
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value); // Update the search query dynamically
    };

    return (
        <header className="header">
            <nav className="header-nav">
                <ul className="header-links">
                    <li><a href="#Đăng ký">Đăng ký</a></li>
                    <li><a href="#Đăng nhập">Đăng nhập</a></li>
                </ul>
                <div className="order-search-container">
                    <div className="order-search">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleInputChange} 
                            />
                            <button type="button">Search</button>
                        </div>
                        <div className="order">
                            <Link to="/cart">
                                Giỏ hàng ({cart.length})
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
