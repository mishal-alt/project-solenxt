import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FiHeart } from "react-icons/fi"; 
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // Stores all products fetched from DB
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search input text
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all", "men", "women", "premium"
  const [sortOrder, setSortOrder] = useState(""); // Sorting: "lowToHigh" or "highToLow"
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) // Load current logged-in user from localStorage
  );
  const [wishlist, setWishlist] = useState(currentUser?.wishlist || []); // User's wishlist IDs
  const [cart, setCart] = useState(currentUser?.cart || []); // User's cart products
  const [currentPage, setCurrentPage] = useState(1); // For pagination (tracks which page we are on)
  const itemsPerPage = 8; // Number of products to show per page

  
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const updateUserData = async (updatedData) => {
    if (!currentUser) return; // Prevents running if no user logged in

    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData), // Send updated data 
      });
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  const toggleWishlist = async (id) => {
    // If user not logged in
    if (!currentUser) {
      toast.error("Please login first to manage your wishlist!");
      navigate("/login");
      return;
    }

    const updatedWishlist = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];

    setWishlist(updatedWishlist);

    // Update localStorage + state
    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update DB (json-server)
    await updateUserData({ wishlist: updatedWishlist });

    // Notify navbar (so heart count updates)
    window.dispatchEvent(new Event("wishlistUpdated"));

    // ✅ Show notification
    if (updatedWishlist.includes(id)) toast.success("Added to wishlist!");
    else toast.info("Removed from wishlist!");
  };

  // ✅ Add a product to cart
  const addToCart = async (product) => {
    // If user not logged in
    if (!currentUser) {
      toast.error("Please login first to add products to cart!");
      navigate("/login");
      return;
    }

    // Check if already in cart
    const isAlreadyInCart = cart.some((item) => item.id === product.id);
    if (isAlreadyInCart) return;

    // Add product with quantity 1
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);

    // Update user and localStorage
    const updatedUser = { ...currentUser, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update DB
    await updateUserData({ cart: updatedCart });

    // Notify navbar (cart count updates)
    window.dispatchEvent(new Event("cartUpdated"));

    // Toast
    toast.success("Added to cart!");
  };

  // ✅ Apply search filter
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Apply category filters
  if (categoryFilter === "men")
    filteredProducts = filteredProducts.filter((p) => p.cat === "men");
  if (categoryFilter === "women")
    filteredProducts = filteredProducts.filter((p) => p.cat === "women");
  if (categoryFilter === "premium")
    filteredProducts = filteredProducts.filter((p) => p.premium === true);

  // ✅ Apply sorting
  if (sortOrder === "lowToHigh")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "highToLow")
    filteredProducts.sort((a, b) => b.price - a.price);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Total pages count
  const startIndex = (currentPage - 1) * itemsPerPage; // Starting product index
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage // End index (not inclusive)
  );

  // ✅ Reset current page when search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="bg-black min-h-screen py-20 px-6">
      {/* ✅ Page title */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight p-10 text-white">
        PRODUCTS
      </h1>

      {/* ✅ Search bar + Filters + Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-black p-4 rounded-xl">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category + Sort dropdowns */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Category filter */}
          <select
            className="p-3 rounded-lg text-white bg-black border border-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="premium">Premium</option>
          </select>

          {/* Sort order */}
          <select
            className="p-3 rounded-lg text-white bg-black border border-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ✅ Product grid display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            // Check if product already in cart
            const isInCart = cart.find((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="relative border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition bg-white transform hover:-translate-y-3"
              >
                {/* Wishlist icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 text-2xl transition ${
                    currentUser
                      ? "text-gray-500 hover:scale-110"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {wishlist.includes(product.id) ? (
                    <FaHeart className="text-red-500" /> // Filled heart
                  ) : (
                    <FiHeart /> // Empty heart
                  )}
                </button>

                {/* Product image + info */}
                <Link to={`/product/${product.id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-xl"
                  />
                  <h2 className="mt-3 text-lg font-bold text-black">
                    {product.name}
                  </h2>

                  <p className="text-gray-700 mt-1">₹{product.price}</p>

                  {/* Stock display */}
                  <p
                    className={
                      product.stoke > 0
                        ? "text-green-500"
                        : "text-red-600 font-bold"
                    }
                  >
                    {product.stoke > 0
                      ? `In Stock (${product.stoke} left)`
                      : "Out of Stock"}
                  </p>
                </Link>

                {/* Add to cart / Go to cart button */}
                {isInCart ? (
                  <button
                    onClick={() => {
                      if (!currentUser) navigate("/login");
                      else navigate("/cart");
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className={`mt-3 w-full py-2 rounded-xl ${
                      currentUser
                        ? "bg-black hover:bg-gray-900"
                        : "bg-gray-500 cursor-not-allowed"
                    } text-white transition`}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-white text-center col-span-full text-lg">
            No products found.
          </p>
        )}
      </div>

      {/* ✅ Pagination buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          {/* Prev button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Prev
          </button>

          {/* Page number display */}
          <span className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Product;
