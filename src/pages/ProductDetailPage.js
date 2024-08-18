import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  getExchangeRate,
  convertToINR,
  formatCurrency,
} from "../utils/currencyUtils"; // Adjust the import path as needed

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
  const { cartItems, addToCart } = useCart(); // Access cartItems to check if the product is already in the cart
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const rate = await getExchangeRate();
      setExchangeRate(rate);
    };

    fetchExchangeRate();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found</p>;

  const priceInINR = convertToINR(product.price, exchangeRate);

  // Check if the product is already in the cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleButtonClick = () => {
    if (isInCart) {
      navigate("/cart"); // Redirect to the cart page
    } else {
      addToCart(product); // Add the product to the cart
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mb-4">
              {formatCurrency(priceInINR)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <button
              onClick={handleButtonClick}
              className={`${
                isInCart ? "bg-purple-600" : "bg-purple-700"
              } text-white py-3 px-6 rounded-lg hover:${
                isInCart ? "bg-purple-600" : "bg-purple-700"
              } transition duration-200`}
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Additional Section: Related Products */}
        <div className="p-8 bg-gray-50 mt-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/150"
                alt="Related Product"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">Product 1</h3>
              <p className="text-gray-600">₹999</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/150"
                alt="Related Product"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">Product 2</h3>
              <p className="text-gray-600">₹1,299</p>
            </div>
            {/* Add more related products as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
