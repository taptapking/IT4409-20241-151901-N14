import React from "react";
import { Link } from "react-router-dom";

function Header({ cart, searchQuery, setSearchQuery }) {


  const handleInputChange 
  = (e) => {
    setSearchQuery(e.target.value); 
  };


  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-left">
          <div className="search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button type="button">Search</button>
          </div>
        </div>
        <div className="header-right">
          <ul className="header-links">
          <li>
  <div 
    className="account-dropdown"
    onMouseEnter={() => setDropdownVisible(true)} 
    onMouseLeave={() => setDropdownVisible(false)} 
  > 
  </div>
</li>


            <li><Link to="/cart">Cart ({cart.length})</Link></li>
          </ul>
        </div>
      </nav>

        </header>
  );
}
export default Header;
