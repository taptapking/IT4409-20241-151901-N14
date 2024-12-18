import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal"; 
import SignIn from "../pages/SignIn"; 
import SignUp from "../pages/SignUp"; 

function Header({ cart, searchQuery, setSearchQuery }) {
  const [isModalOpen, setModalOpen] = useState(false); 
  const [isSignUp, setIsSignUp] = useState(false); 

  const handleInputChange = (e) => {
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
            <Link onClick={() => { openModal(); setIsSignUp(false); }}>Account</Link>
            </li>
            <li><Link to="/cart">Giỏ hàng ({cart.length})</Link></li>
          </ul>
        </div>
      </nav>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSignUp ? (
          <SignUp toggleForm={toggleForm} /> // Render SignUp component
        ) : (
          <SignIn toggleForm={toggleForm} /> // Render SignIn component
        )}
      </Modal>
    </header>
  );
}

export default Header;
