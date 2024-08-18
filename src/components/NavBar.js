import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const NavBar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useContext(AuthContext); // Access user and logout from context
  const cartItemLength = cartItems.length;

  return (
    <nav className="bg-purple-400 text-white flex justify-between items-center h-16 px-4 md:px-8 shadow-md">
      <Link className="text-2xl md:text-3xl font-bold" to="/">
        MyStore
      </Link>
      <div className="flex items-center space-x-4 md:space-x-6">
        <Link
          className="text-lg md:text-xl hover:text-gray-200 transition-colors"
          to="/"
        >
          Home
        </Link>
        <Link
          className="text-lg md:text-xl hover:text-gray-200 transition-colors"
          to="/products"
        >
          Products
        </Link>
        <Link
          className="text-lg md:text-xl hover:text-gray-200 transition-colors"
          to="/cart"
        >
          Cart{" "}
          {cartItemLength > 0 ? (
            <span className="bg-orange-200 text-white rounded-full px-2">
              {cartItemLength}
            </span>
          ) : null}
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg md:text-xl">Welcome, {user.name}!</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            className="text-lg md:text-xl hover:text-gray-200 transition-colors"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
