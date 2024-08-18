import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Fetch products from API
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 8)); // Show only the first 8 products
        setFilteredProducts(data.slice(0, 8));
      });

    // Reset filters on home page load
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("reset")) {
      setPriceRange([0, 1000]);
      setCategory("");
      filterProducts({ priceRange: [0, 1000], category: "" });
      navigate({ search: "" }); // Clear query parameters
    } else {
      filterProducts({ priceRange, category });
    }
  }, [location.search, navigate]);

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-");
    setPriceRange([parseInt(min), parseInt(max)]);
    filterProducts({ priceRange: [parseInt(min), parseInt(max)], category });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    filterProducts({ priceRange, category: e.target.value });
  };

  const filterProducts = ({ priceRange, category }) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filters</h3>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price Range</label>
            <select
              onChange={handlePriceChange}
              value={`${priceRange[0]}-${priceRange[1]}`}
              className="w-full p-2 border rounded"
            >
              <option value="0-1000">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Category</label>
            <select
              onChange={handleCategoryChange}
              value={category}
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold">{product.title}</h3>
              </Link>
              <p className="text-gray-700">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* View All Products Button */}
      <div className="text-center mt-8">
        <Link
          to="/products"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          View All Products
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Your Store Name. All Rights Reserved.</p>
        <div className="flex justify-center mt-4">
          <Link to="/about" className="mr-4 hover:underline">
            About Us
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
        <div className="mt-4">
          <p>Follow us on:</p>
          <div className="flex justify-center mt-2">
            <a href="#" className="mr-2 hover:underline">
              Facebook
            </a>
            <a href="#" className="mr-2 hover:underline">
              Twitter
            </a>
            <a href="#" className="hover:underline">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
