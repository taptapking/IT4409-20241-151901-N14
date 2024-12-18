import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal"; 
import SignIn from "../pages/SignIn"; 
import SignUp from "../pages/SignUp"; 

function Header({ cart, searchQuery, setSearchQuery, setToken, token }) {
  const [isModalOpen, setModalOpen] = useState(false); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const handleInputChange 
  = (e) => {
    setSearchQuery(e.target.value); 
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); 
  };

  const handleLogout = () => {
    setToken(null);
    setAccountId(null);
    navigate("/");
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
    <Link
      to="#"
      onClick={(e) => { 
        e.preventDefault(); 
        if (!token) openModal(); 
        setIsSignUp(false); 
      }}
    >
      Account
    </Link>

    {token && isDropdownVisible && (
      <div className={`dropdown-content ${isDropdownVisible ? 'show' : ''}`}>
        <ul>
          <li>
            <Link to={`/account/${accountId}`}>Account Details</Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={(e) => { 
                e.preventDefault();
                handleLogout(); 
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    )}
  </div>
</li>


            <li><Link to="/cart">Cart ({cart.length})</Link></li>
          </ul>
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSignUp ? (
          <SignUp toggleForm={toggleForm} />
        ) : (
          <SignIn 
            toggleForm={toggleForm} 
            setToken={setToken} 
            onLoginSuccess={closeModal} 
            setAccountId={setAccountId} 
          />
        )}
      </Modal>
    </header>
  );
}

export default Header;
