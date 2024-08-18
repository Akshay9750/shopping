import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const NavBar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useContext(AuthContext); // Access user and logout from context
  const cartItemLength = cartItems.length;

  return (
    <nav className="flex justify-between bg-purple-600 h-16">
      <Link className="pl-48 text-4xl pt-3" to="/">
        MyStore
      </Link>
      <div className="flex p-3">
        <Link className="text-4xl pl-4" to="/">
          Home
        </Link>
        <Link className="text-4xl pl-4" to="/products">
          Products
        </Link>
        <Link className="text-4xl pl-4" to="/cart">
          Cart {cartItemLength > 0 ? <span> ({cartItemLength})</span> : null}
        </Link>
        {user ? (
          <div className="flex items-center pl-4">
            <span className="text-4xl">Welcome, {user.name}!</span>
            <button
              className="ml-4 text-4xl bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link className="text-4xl pl-4" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
