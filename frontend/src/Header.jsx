function Header() {
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
                            <input type="text" placeholder="Search..." />
                            <button type="button">Search</button>
                        </div>
                        <div className="order">
                            <a href="#Giỏ hàng">Giỏ hàng</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
