import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi"; // outline heart icon
import { FaHeart } from "react-icons/fa"; // filled heart icon

function Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ Load & Save Wishlist to localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ Toggle Wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ✅ Fetch Products
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ Filtered + Sorted Products
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filter === "men") filteredProducts = filteredProducts.filter((p) => p.cat === "men");
  if (filter === "women") filteredProducts = filteredProducts.filter((p) => p.cat === "women");
  if (filter === "premium") filteredProducts = filteredProducts.filter((p) => p.premium === true);
  if (filter === "lowToHigh") filteredProducts.sort((a, b) => a.price - b.price);
  if (filter === "highToLow") filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="bg-black min-h-screen py-20 px-6">
      <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight p-10 text-white">
        PRODUCTS
      </h1>

      {/* 🔹 Search + Filter */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-10 bg-black p-4 rounded-xl">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 p-3 rounded-lg text-white bg-black border border-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="premium">Premium</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition bg-white transform hover:-translate-y-3"
            >
              {/* ❤️ Wishlist Heart (Outside Link) */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:scale-110 transition"
              >
                {wishlist.includes(product.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FiHeart />
                )}
              </button>

              {/* 🛍️ Product Link */}
              <Link to={`/product/${product.id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-xl"
                />
                <h2 className="mt-3 text-lg font-bold text-black">{product.name}</h2>
                <p className="text-gray-700 mt-1">₹{product.price}</p>
              </Link>

              <button className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Product;
