import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  getExchangeRate,
  convertToINR,
  formatCurrency,
} from "../utils/currencyUtils"; // Adjust the import path as needed

const categoryMapping = {
  Electronics: "electronics",
  Jewelery: "jewelery",
  "Men's Clothing": "men's clothing",
  "Women's Clothing": "women's clothing",
};

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
  const [clickedProducts, setClickedProducts] = useState(new Set()); // To track clicked products
  const { addToCart } = useCart();
  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation();

  // Get the category from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const rate = await getExchangeRate();
      setExchangeRate(rate);
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const productsWithINR = response.data.map((product) => ({
          ...product,
          priceInINR: convertToINR(product.price, exchangeRate),
        }));
        setProducts(productsWithINR);
        filterProducts(productsWithINR, category);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, exchangeRate]);

  // Filter products based on the category
  const filterProducts = (products, category) => {
    if (category) {
      const standardizedCategory = categoryMapping[category];
      setFilteredProducts(
        products.filter((product) => product.category === standardizedCategory)
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setClickedProducts((prev) => new Set(prev).add(product.id)); // Track clicked product
  };

  const handleGoToCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {category ? `Products in ${category}` : "Product List"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.title}
                  </h2>
                </Link>
                <p className="text-gray-600 font-medium mb-2">
                  {formatCurrency(product.priceInINR)}{" "}
                  {/* Display price in INR */}
                </p>
                <p className="text-gray-500 mb-4 text-sm line-clamp-2">
                  {product.description}
                </p>
                {clickedProducts.has(product.id) ? (
                  <button
                    onClick={handleGoToCart}
                    className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
