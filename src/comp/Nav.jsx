import { useState } from "react";
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between ">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Link to='/'><img src={logo} alt="SoleNxt Logo" className="h-30 w-30 object-contain" /></Link>

        </div>


        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">

          <Link
            to="/"
            className="group relative text-black transition-all duration-300 ease-in-out hover:text-blue-500 hover:-translate-y-0.5"
          >
            Home
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/men"
            className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          >
            Men
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/women"
            className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          >
            Women
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/about"
            className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          >
            About
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/contact"
            className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          >
            Contact
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center space-x-5">
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for shoes..."
              className="pl-9 pr-3 py-2 rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-black -400 outline-none"
            />
          </div>

          <Link to='/wishlist'><FiHeart className="text-2xl text-gray-600 hover:text-black -500 cursor-pointer transition" /></Link>
          <Link to='/cart'><FiShoppingBag className="text-2xl text-gray-600 hover:text-black -500 cursor-pointer transition" /></Link>

          <div className="hidden md:flex items-center space-x-3">
            <button className="text-sm font-medium text-gray-70 hover:text-white -500"><Link to='/login' className="text-black font-semibold no-underline hover:underline hover:text-gray-700">Login In</Link></button>

          </div>

          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col items-center space-y-4 py-4 text-gray-700 font-medium">
            <Link
              to="/"
              className="group relative text-black transition-all duration-300 ease-in-out hover:text-blue-500 hover:-translate-y-0.5"
            >
              Home
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/men"
              className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              Men
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/women"
              className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              Women
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/sale"
              className="group relative hover:text-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              Sale
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <button className="text-sm font-medium text-gray-700 hover:text-white -500">Sign In</button>

          </nav>
        </div>
      )}
    </header>
  );
}
