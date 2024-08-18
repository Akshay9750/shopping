import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-12 bg-gray-800 text-white p-4 text-center">
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
    </div>
  );
};

export default Footer;
