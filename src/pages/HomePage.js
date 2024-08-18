import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getExchangeRate,
  convertToINR,
  formatCurrency,
} from "../utils/currencyUtils";
import axios from "axios";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
  const navigate = useNavigate();

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
        setCurrentProducts(productsWithINR.slice(0, 4)); // Initially show the first 4 products
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, [exchangeRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => {
        const nextIndex = (prevIndex + 4) % products.length;
        setCurrentProducts(products.slice(nextIndex, nextIndex + 4));
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [products]);

  const handlePrev = () => {
    setStartIndex((prevIndex) => {
      const newIndex = (prevIndex - 4 + products.length) % products.length;
      setCurrentProducts(products.slice(newIndex, newIndex + 4));
      return newIndex;
    });
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => {
      const newIndex = (prevIndex + 4) % products.length;
      setCurrentProducts(products.slice(newIndex, newIndex + 4));
      return newIndex;
    });
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-gray-800 text-white h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.vectorstock.com/i/500p/57/56/template-banner-for-online-store-with-shopping-vector-42935756.jpg')",
        }}
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MyStore</h1>
          <p className="text-lg mb-6">
            Discover the best deals on your favorite products.
          </p>
          <Link to="/products">
            <button className="bg-purple-400 text-white px-6 py-3 rounded-lg text-xl hover:bg-purple-500 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {formatCurrency(product.priceInINR)}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <button className="bg-purple-500  text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors w-full">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Navigation Arrows */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-200"
            onClick={handlePrev}
          >
            &lt;
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-200"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-4">
            {[
              "Electronics",
              "Jewelery",
              "Men's Clothing",
              "Women's Clothing",
            ].map((category) => (
              <div
                key={category}
                className="bg-white shadow-md rounded-lg p-4 flex-1 text-center transition-transform transform hover:scale-105 hover:shadow-lg"
                onClick={() => handleCategoryClick(category)}
              >
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <img
                  src={
                    category === "Electronics"
                      ? "https://www.shutterstock.com/image-vector/online-electronics-shopping-delivery-banner-260nw-2282200763.jpg"
                      : category === "Jewelery"
                      ? "https://sukkhi.com/cdn/shop/files/bangles_6f2222d4-639b-4646-aa2b-d32f7195b580_580x.jpg?v=1614287315"
                      : category === "Men's Clothing"
                      ? "https://qph.cf2.quoracdn.net/main-qimg-c9f4153381c7953a742fc0e9e8e8c06d-pjlq"
                      : "https://asset20.ckassets.com/blog/wp-content/uploads/sites/5/2021/12/Womens-Clothing.jpg"
                  }
                  alt={category}
                  className="w-full h-32 object-cover rounded transition-transform transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="bg-orange-200 p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Special Offers</h2>
        <p className="text-lg mb-4">
          Don't miss out on our exclusive deals and discounts!
        </p>
        <Link to="/products">
          <button className="bg-red-400 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-500 transition-colors">
            Explore Deals
          </button>
        </Link>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white p-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <div className="flex flex-wrap gap-4">
            {/* Example testimonial */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex-1 text-center">
              <p className="text-lg mb-2">
                "Great store with amazing products! Highly recommended."
              </p>
              <p className="font-semibold">John Doe</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
