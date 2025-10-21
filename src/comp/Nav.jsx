import { useState, useEffect } from "react";
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';


const checkLoginStatus = () => {
  // Returns true if either currentUser or adminUser exists in localStorage
  return localStorage.getItem('currentUser') || localStorage.getItem('adminUser');
};



export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!checkLoginStatus());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem('currentUser'))
    if (storedName) {
      setUsername(storedName.fullName);
    }
  }, [username]);

  // Function to handle logging out
  const handleLogout = () => {
    // 1. Remove user data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminUser');

    // 2. Update state to trigger re-render of the navbar buttons
    setIsLoggedIn(false);

    // 3. CRITICAL: Dispatch the event to update all components immediately
    window.dispatchEvent(new Event('storage'));

    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to the login page
    window.location.reload(); // <-- refreshes the current page

  }


  // useEffect to listen for the custom 'storage' event (dispatched from Login/Signup)
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-check the login status whenever the custom 'storage' event is dispatched
      setIsLoggedIn(!!checkLoginStatus());
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Initial check (to ensure correct state on page load)
    handleStorageChange();

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
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
          <Link to='/wishlist'><FiHeart className="text-2xl text-gray-600 hover:text-black -500 cursor-pointer transition" /></Link>
          <Link to='/cart'><FiShoppingBag className="text-2xl text-gray-600 hover:text-black -500 cursor-pointer transition" /></Link>
          <span className="text-black font-medium">HI {username}</span>

          {/* Dynamic Login/Logout Button (The Core Change) */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition"
              >
                Logout

              </button>

            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Login
              </Link>
            )}

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
            <span className="text-black font-medium">{username}</span>
            <button className="text-sm font-medium text-gray-700 hover:text-white -500">Sign In</button>

          </nav>
        </div>
      )}
    </header>
  );
}
