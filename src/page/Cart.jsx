import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user?.cart || [];
  });

  const updateUserCart = async (updatedCart) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
    } catch (error) {
      console.error("Error updating cart in DB:", error);
    }
  };

  const syncCart = async (updatedCart) => {
    setCart(updatedCart);k
    const user = JSON.parse(localStorage.getItem("currentUser"));
    user.cart = updatedCart;
    localStorage.setItem("currentUser", JSON.stringify(user));
    await updateUserCart(updatedCart);

    // 🔹 Notify Navbar about cart changes
    if (updatedCart.length === 0) {
      // ✅ If cart empty, fire "cartCleared" event to reset Navbar count
      window.dispatchEvent(new Event("cartCleared"));
    } else {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    syncCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    syncCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    syncCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-30">
      <h2 className="text-3xl font-semibold mb-6 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty!</p>
          <Link
            to="/product"
            className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-gray-200 px-3 py-1 rounded-lg text-lg"
                >
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-gray-200 px-3 py-1 rounded-lg text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold">
              Total: ₹{total.toLocaleString()}
            </h3>
            <button
              onClick={() => {
                navigate("/payment");
                // ✅ Optional: trigger event before navigating
                if (cart.length === 0) {
                  window.dispatchEvent(new Event("cartCleared"));
                }
              }}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
