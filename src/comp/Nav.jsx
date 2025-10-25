import React, { useEffect, useState } from "react";
import { FiHeart, FiShoppingBag, FiTruck } from "react-icons/fi";
import logo from "../assets/logo.png";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

const checkLoginStatus = () => {
    return localStorage.getItem("currentUser") || localStorage.getItem("adminUser");
};

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!checkLoginStatus());
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false); // Admin flag
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

        if (currentUser) {
            setUsername(currentUser.fullName);
            setWishlistCount(currentUser.wishlist?.length || 0);
            setCartCount(currentUser.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0);
            setIsAdmin(false);
        }

        if (adminUser) {
            setUsername(adminUser.fullName);
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        const updateWishlistCount = () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            setWishlistCount(currentUser?.wishlist?.length || 0);
        };
        const updateCartCount = () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            setCartCount(currentUser?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0);
        };
        window.addEventListener("wishlistUpdated", updateWishlistCount);
        window.addEventListener("cartUpdated", updateCartCount);
        return () => {
            window.removeEventListener("wishlistUpdated", updateWishlistCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("adminUser");
        setIsLoggedIn(false);
        setIsAdmin(false);
        toast.success("Logged out successfully!");
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/"><img src={logo} alt="SoleNxt Logo" className="h-30 w-30 object-contain" /></Link>
                <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <Link to="/" className="group relative hover:text-blue-500 transition">Home</Link>
                    <Link to="/product" className="group relative hover:text-blue-500 transition">Shop</Link>
                    <Link to="/about" className="group relative hover:text-blue-500 transition">About</Link>
                    <Link to="/contact" className="group relative hover:text-blue-500 transition">Contact</Link>
                </nav>
                <div className="flex items-center space-x-5">
                    <Link to="/wishlist" className="relative">
                        <FiHeart className="text-2xl text-gray-600 hover:text-black cursor-pointer transition" />
                        {wishlistCount > 0 && <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="relative">
                        <FiShoppingBag className="text-2xl text-gray-600 hover:text-black cursor-pointer transition" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">{cartCount}</span>}
                    </Link>
                    {isLoggedIn && !isAdmin && (
                        <Link to="/order" className="relative">
                            <FiTruck className="text-2xl text-gray-600 hover:text-black cursor-pointer transition" />
                        </Link>
                    )}

                    {isLoggedIn && (
                        <span className="text-gray-800 font-medium">HI {username}</span>
                    )}

                    {/* Admin button for admins */}
                    {isAdmin && (
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition"
                        >
                            Admin
                        </button>
                    )}

                    {/* Logout button for both normal users and admins */}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition"
                        >
                            Logout
                        </button>
                    )}

                    {!isLoggedIn && (
                        <Link to="/login" className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
