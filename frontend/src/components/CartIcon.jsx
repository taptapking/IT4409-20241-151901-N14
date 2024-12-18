import React from "react";
import { Link } from "react-router-dom";

const CartIcon = ({ itemCount }) => {
  return (
    <div className="relative group">
      {/* Cart Icon */}
      <Link to="/cart" className="relative">
        <i className="fa-solid fa-cart-shopping text-primary-500 text-2xl"></i>
      </Link>

      {/* Badge for item count */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center shadow">
          {itemCount}
        </span>
      )}

      {/* Popup to show current cart count */}
      <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 text-sm text-gray-700 z-10">
        You have {itemCount} item{itemCount > 1 ? "s" : ""} in your cart.
      </div>
    </div>
  );
};

export default CartIcon;
