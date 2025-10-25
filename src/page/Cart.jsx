import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate(); // Hook to programmatically navigate to another page

  // State for storing cart items, initialized from localStorage if available
  const [cart, setCart] = useState(() => {
    const user = JSON.parse(localStorage.getItem("currentUser")); // Get current user from localStorage
    return user?.cart || []; // Use user's cart or empty array if none
  });

  // Function to update cart in backend database
  const updateUserCart = async (updatedCart) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get user
    if (!currentUser) return; // If no user, exit

    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, { // PATCH request to backend
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }), // Send updated cart
      });
    } catch (error) {
      console.error("Error updating cart in DB:", error); // Log errors
    }
  };

  // Sync cart to state, localStorage, backend, and trigger update event
  const syncCart = async (updatedCart) => {
    setCart(updatedCart); // Update React state
    const user = JSON.parse(localStorage.getItem("currentUser")); 
    user.cart = updatedCart; // Update cart in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    await updateUserCart(updatedCart); // Update cart in backend
    window.dispatchEvent(new Event("cartUpdated")); // Notify other components (like Navbar)
  };

  // Increase quantity of a cart item by 1
  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    syncCart(updatedCart); // Sync updates
  };

  // Decrease quantity of a cart item by 1, remove if quantity goes to 0
  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
    syncCart(updatedCart); // Sync updates
  };

  // Remove an item completely from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id); // Filter out removed item
    syncCart(updatedCart); // Sync updates
  };

  // Calculate total price of items in cart
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-30">
      <h2 className="text-3xl font-semibold mb-6 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        // Empty cart message
        <div className="text-center text-gray-500">
          <p>Your cart is empty!</p>
          <Link to="/product" className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            Go Shopping
          </Link>
        </div>
      ) : (
        // Cart items list
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Decrease quantity button */}
                <button onClick={() => decreaseQty(item.id)} className="bg-gray-200 px-3 py-1 rounded-lg text-lg">-</button>
                <span className="text-lg">{item.quantity}</span> {/* Show quantity */}
                {/* Increase quantity button */}
                <button onClick={() => increaseQty(item.id)} className="bg-gray-200 px-3 py-1 rounded-lg text-lg">+</button>
              </div>

              {/* Remove item button */}
              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          ))}

          {/* Total price and checkout button */}
          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold">Total: ₹{total.toLocaleString()}</h3>
            <button onClick={() => navigate("/payment")} className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart; // Export Cart component
