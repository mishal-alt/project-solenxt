// src/page/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);

    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const wishlistItems = products.filter((item) => wishlist.includes(item.id));

  return (
    <div className="bg-black min-h-screen py-20 px-6 text-white mt-20">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12">
        My Wishlist 
      </h1>

      {wishlistItems.length > 0 ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-center justify-between bg-zinc-900 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Left side: Image + info */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-cover rounded-xl border border-zinc-700"
                />
                <div>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-400 mt-1">₹{product.price}</p>
                </div>
              </div>

              {/* Right side: Actions */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  <FaHeart className="text-red-500" />
                  <span>Remove</span>
                </button>

                <button className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-300 text-lg">
            Your wishlist is empty 
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
