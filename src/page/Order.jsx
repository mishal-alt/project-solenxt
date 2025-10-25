// Importing necessary modules
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // for showing success/error notifications

function Order() {
    const navigate = useNavigate(); // Hook for programmatic navigation (redirect)
    const [orders, setOrders] = useState([]); // State to hold user's orders

    // ✅ Update user data (orders) in the backend (db.json)
    const updateUserData = async (updatedData) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // get current logged-in user
        if (!currentUser) return; // if user not found, stop

        try {
            // PATCH request updates only the specified fields (not the entire object)
            await fetch(`http://localhost:3001/users/${currentUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData), // send updated user data (like orders)
            });
        } catch (err) {
            console.error("Error updating user data:", err);
        }
    };

    // ✅ Reduce stock quantity after confirming an order
    const updateProductStock = async (orderItems) => {
        try {
            for (const item of orderItems) {
                // Fetch the product from backend using product ID
                const res = await fetch(`http://localhost:3001/products/${item.id}`);
                const product = await res.json();

                // Calculate new stock count
                const updatedStock = product.stoke - item.quantity;

                // Prevent stock going negative
                if (updatedStock < 0) {
                    toast.error(`Not enough stock for ${product.name}`);
                    continue;
                }

                // Update stock value in backend
                await fetch(`http://localhost:3001/products/${item.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stoke: updatedStock }),
                });
            }
        } catch (err) {
            console.error("Error updating product stock:", err);
        }
    };

    // ✅ Restore stock quantity when order is cancelled
    const restoreProductStock = async (orderItems) => {
        try {
            for (const item of orderItems) {
                // Get product data from backend
                const res = await fetch(`http://localhost:3001/products/${item.id}`);
                const product = await res.json();

                // Add back the cancelled quantity to stock
                const updatedStock = product.stoke + item.quantity;

                // Update stock in backend
                await fetch(`http://localhost:3001/products/${item.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stoke: updatedStock }),
                });
            }
        } catch (err) {
            console.error("Error restoring product stock:", err);
        }
    };

    // ✅ useEffect runs when component first loads
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            navigate("/login"); // redirect to login if user not logged in
            return;
        }
        // Load user's orders from localStorage
        setOrders(currentUser.orders || []);
    }, [navigate]);

    // ✅ Change background color based on order status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-200 text-yellow-800";
            case "shipped": return "bg-blue-200 text-blue-800";
            case "delivered": return "bg-green-200 text-green-800";
            case "cancelled": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    // ✅ Cancel an order
    const handleCancelOrder = async (orderId) => {
        // Ask confirmation before canceling
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        // Find the order by its ID
        const order = orders.find(o => o.id === orderId);

        // Update status of the selected order to "Cancelled"
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) order.status = "Cancelled";
            return order;
        });

        // Update state and localStorage
        setOrders(updatedOrders);
        currentUser.orders = updatedOrders;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Update backend data
        await updateUserData({ orders: updatedOrders });

        // Restore stock for the cancelled items
        if (order) {
            await restoreProductStock(order.items);
        }

        // Show success message
        toast.success("Order cancelled and stock restored!");
    };

    // ✅ Confirm order (reduces product stock)
    const handleConfirmOrder = async (orderId) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Change order status to "Shipped" (can also be "Delivered")
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) order.status = "Shipped";
            return order;
        });

        // Update UI and save locally
        setOrders(updatedOrders);
        currentUser.orders = updatedOrders;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Save updates in backend
        await updateUserData({ orders: updatedOrders });
        // Deduct stock for the confirmed order items
        await updateProductStock(order.items);

        toast.success("Order confirmed ");
    };

    // ✅ UI Rendering
    return (
        <div className="min-h-screen bg-gray-50 py-24 px-6 mt-30">
            <h1 className="text-4xl font-bold text-center mb-10">📦 Order Tracking</h1>

            {/* If user has no orders */}
            {orders.length === 0 ? (
                <p className="text-center text-gray-500">You have no orders yet.</p>
            ) : (
                // Display order cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
                            <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                            <p className="text-gray-600 mb-2">Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-2">Total: ₹{order.total.toLocaleString()}</p>

                            {/* Dynamic color badge for order status */}
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </div>

                            {/* List of ordered items */}
                            <div className="mt-4">
                                <h3 className="font-semibold mb-1">Items:</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.name} × {item.quantity} (₹{item.price})</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Show "Cancel" and "Confirm" buttons only for pending orders */}
                            {order.status.toLowerCase() === "pending" && (
                                <div className="flex gap-2 mt-4">
                                    <button 
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition">
                                        Cancel Order
                                    </button>
                                    <button 
                                        onClick={() => handleConfirmOrder(order.id)}
                                        className="w-1/2 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition">
                                        Confirm Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Order;
