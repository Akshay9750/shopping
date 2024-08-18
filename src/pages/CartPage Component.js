import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
  getExchangeRate,
  convertToINR,
  formatCurrency,
} from "../utils/currencyUtils";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccessful, setOrderSuccessful] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [invalidCode, setInvalidCode] = useState("");

  const discountCodes = [
    { code: "20OFF5000", minAmount: 5000, discount: 0.2 },
    { code: "10OFF2000", minAmount: 2000, discount: 0.1 },
    // Add more codes as needed
  ];

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const rate = await getExchangeRate();
        setExchangeRate(rate);
      } catch (err) {
        setError("Failed to fetch exchange rate");
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  const handleQuantityChange = (id, event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      updateQuantity(id, value);
    }
  };

  const calculateTotalInINR = () => {
    if (loading || error) {
      return 0;
    }

    const totalUSD = cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
    const totalINR = convertToINR(totalUSD, exchangeRate);
    return totalINR - discountApplied;
  };

  const handleCheckout = () => {
    clearCart();
    setOrderSuccessful(true);
  };

  const applyDiscount = () => {
    const code = discountCodes.find((dc) => dc.code === discountCode);

    if (code) {
      const { minAmount, discount } = code;
      const totalInINR = calculateTotalInINR() + discountApplied;
      if (totalInINR >= minAmount) {
        setDiscountApplied(totalInINR * discount);
        setInvalidCode("");
      } else {
        setInvalidCode(
          `Discount code is only valid for orders above ${formatCurrency(
            minAmount
          )}`
        );
      }
    } else {
      setInvalidCode("Invalid discount code");
    }
  };

  const removeDiscount = () => {
    setDiscountCode("");
    setDiscountApplied(0);
  };

  if (loading) return <p>Loading exchange rate...</p>;
  if (error) return <p>{error}</p>;

  const grossAmount = calculateTotalInINR() + discountApplied;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {orderSuccessful ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Order Successful!</h2>
          <p className="text-lg mb-4">Thank you for your purchase.</p>
          <Link
            to="/products"
            className="bg-[#481189] text-white py-2 px-4 rounded hover:bg-[#a72aaa] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex gap-8">
          {/* Cart Products */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center">
                <img
                  src="https://mir-s3-cdn-cf.behance.net/projects/404/95974e121862329.Y3JvcCw5MjIsNzIxLDAsMTM5.png"
                  alt="Empty Cart"
                  className="mx-auto mb-4 w-150 h-150 max-w-4xl object-contain"
                />
                <Link
                  to="/products"
                  className="bg-[#481189] text-white py-2 px-4 rounded hover:bg-[#a72aaa] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div>
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center bg-white shadow-md rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>
                          <p className="text-gray-700">
                            {formatCurrency(item.price * exchangeRate)}
                          </p>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="w-80 flex-none bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Discount Summary</h2>
            <p className="text-gray-700 mb-2">
              Gross Amount: {formatCurrency(grossAmount)}
            </p>
            <p className="text-gray-700 mb-2">
              Discount Applied: -{formatCurrency(discountApplied)}
            </p>
            <p className="text-lg font-semibold mb-4">
              Total Amount: {formatCurrency(calculateTotalInINR())}
            </p>

            <h3 className="text-lg font-semibold mb-2">Apply Discount Code</h3>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={applyDiscount}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            {invalidCode && <p className="text-red-500 mt-2">{invalidCode}</p>}
            {discountCode && (
              <button
                onClick={removeDiscount}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors mt-4"
              >
                Remove
              </button>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                Available Discount Codes
              </h2>
              <ul className="space-y-2">
                {discountCodes.map(({ code, minAmount, discount }) => (
                  <li key={code} className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{code}</span>
                      <span className="text-gray-600">
                        Apply {discount * 100}% off
                      </span>
                    </div>
                    <span className="text-gray-500">
                      For orders above {formatCurrency(minAmount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="flex justify-between items-center mt-6">
        <div className="font-semibold text-lg">
          <p></p>
        </div>
        <div className="space-x-4">
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
