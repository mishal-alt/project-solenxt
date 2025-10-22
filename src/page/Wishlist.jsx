import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")));

  useEffect(() => {
    if (currentUser) {
      setWishlist(currentUser.wishlist || []);
      setCart(currentUser.cart || []);
    }

    fetch("http://localhost:3001/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  const updateUserData = async (updatedData) => {
    if (!currentUser) return;
    await fetch(`http://localhost:3001/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  };

  const removeFromWishlist = async (id) => {
    if (!currentUser) return;
    const updatedWishlist = (currentUser.wishlist || []).filter(item => item !== id);
    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    setWishlist(updatedWishlist);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    await updateUserData({ wishlist: updatedWishlist });
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = async (product) => {
    if (!currentUser) return;
    const currentCart = currentUser.cart || [];
    const isInCart = currentCart.find(item => item.id === product.id);
    const updatedCart = isInCart ? currentCart : [...currentCart, { ...product, quantity: 1 }];
    const updatedUser = { ...currentUser, cart: updatedCart };
    setCart(updatedCart);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    await updateUserData({ cart: updatedCart });
  };

  const wishlistItems = products.filter(item => wishlist.includes(item.id));

  return (
    <div className="bg-black min-h-screen py-20 px-6 text-white mt-20">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12">My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {wishlistItems.map(product => (
            <div key={product.id} className="flex flex-col md:flex-row items-center justify-between bg-zinc-900 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-xl border border-zinc-700" />
                <div>
                  <Link to={`/product/${product.id}`} className="text-xl font-semibold hover:underline">{product.name}</Link>
                  <p className="text-gray-400 mt-1">₹{product.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button onClick={() => removeFromWishlist(product.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition">
                  <FaHeart className="text-red-500" />
                  <span>Remove</span>
                </button>
                <button onClick={() => addToCart(product)} className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
                  {cart.find(item => item.id === product.id) ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-300 text-lg">Your wishlist is empty</p>
          <Link to="/" className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">Browse Products</Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
