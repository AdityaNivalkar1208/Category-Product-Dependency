import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Categories
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
