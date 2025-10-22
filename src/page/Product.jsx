import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser"))
  );
  const [wishlist, setWishlist] = useState(currentUser?.wishlist || []);
  const [cart, setCart] = useState(currentUser?.cart || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Fetch products from db.json
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ Update user in db.json
  const updateUserData = async (updatedData) => {
    if (!currentUser) return;
    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  // ✅ Wishlist toggle with login check
  const toggleWishlist = async (id) => {
    if (!currentUser) {
      toast.error("Please login first to manage your wishlist!");
      navigate("/login");
      return;
    }

    const updatedWishlist = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];

    setWishlist(updatedWishlist);

    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    await updateUserData({ wishlist: updatedWishlist });
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // ✅ Add to cart with login check
  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("Please login first to add products to cart!");
      navigate("/login");
      return;
    }

    const isAlreadyInCart = cart.some((item) => item.id === product.id);
    if (isAlreadyInCart) return;

    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);

    const updatedUser = { ...currentUser, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    await updateUserData({ cart: updatedCart });
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ Filtering + Sorting
  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (categoryFilter === "men")
    filteredProducts = filteredProducts.filter((p) => p.cat === "men");
  if (categoryFilter === "women")
    filteredProducts = filteredProducts.filter((p) => p.cat === "women");
  if (categoryFilter === "premium")
    filteredProducts = filteredProducts.filter((p) => p.premium === true);

  if (sortOrder === "lowToHigh")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "highToLow")
    filteredProducts.sort((a, b) => b.price - a.price);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter/search/sort change
  }, [searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="bg-black min-h-screen py-20 px-6">
      <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight p-10 text-white">
        PRODUCTS
      </h1>

      {/* ✅ Search + Filter + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-black p-4 rounded-xl">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-3 w-full md:w-auto">
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

      {/* ✅ Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const isInCart = cart.find((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="relative border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition bg-white transform hover:-translate-y-3"
              >
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 text-2xl transition ${
                    currentUser
                      ? "text-gray-500 hover:scale-110"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {wishlist.includes(product.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FiHeart />
                  )}
                </button>

                {/* Product Link */}
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
                </Link>

                {/* Add to Cart / Go to Cart */}
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

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
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
          <span className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </span>
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
