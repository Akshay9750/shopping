import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, addToCart, updateQuantity } =
    useCart();

  const handleQuantityChange = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, quantity: quantity - product.quantity });
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = 10; // Optional: Fixed $10 discount or change this to a percentage if needed
  const total = subtotal - discount;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3">
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center mb-4 p-4 border-b"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex-grow ml-4">
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-gray-700">{`$${item.price}`}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item, parseInt(e.target.value))
                      }
                      className="mx-2 w-12 text-center border rounded"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
            <p className="text-gray-700">
              Subtotal:{" "}
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
            <p className="text-gray-700">
              Discount:{" "}
              <span className="font-bold">-${discount.toFixed(2)}</span>
            </p>
            <p className="text-xl font-bold mt-4">
              Total: <span>${total.toFixed(2)}</span>
            </p>
            <button
              onClick={() => alert("Proceeding to checkout...")}
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
