import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    // ✅ Update user data in db.json
    const updateUserData = async (updatedData) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        try {
            await fetch(`http://localhost:3001/users/${currentUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
        } catch (err) {
            console.error("Error updating user data:", err);
        }
    };

    // ✅ Update product stock
    const updateProductStock = async (orderItems) => {
        try {
            for (const item of orderItems) {
                // Get current product
                const res = await fetch(`http://localhost:3001/products/${item.id}`);
                const product = await res.json();

                // Calculate new stock
                const updatedStock = product.stoke - item.quantity;
                if (updatedStock < 0) {
                    toast.error(`Not enough stock for ${product.name}`);
                    continue;
                }

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

    // ✅ Restore stock on cancel
    const restoreProductStock = async (orderItems) => {
        try {
            for (const item of orderItems) {
                const res = await fetch(`http://localhost:3001/products/${item.id}`);
                const product = await res.json();

                const updatedStock = product.stoke + item.quantity;

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

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            navigate("/login");
            return;
        }
        setOrders(currentUser.orders || []);
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-200 text-yellow-800";
            case "shipped": return "bg-blue-200 text-blue-800";
            case "delivered": return "bg-green-200 text-green-800";
            case "cancelled": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    // ✅ Cancel order
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const order = orders.find(o => o.id === orderId);

        const updatedOrders = orders.map(order => {
            if (order.id === orderId) order.status = "Cancelled";
            return order;
        });

        setOrders(updatedOrders);
        currentUser.orders = updatedOrders;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        await updateUserData({ orders: updatedOrders });

        if (order) {
            await restoreProductStock(order.items);
        }

        toast.success("Order cancelled and stock restored!");
    };

    // ✅ Confirm order (reduces stock)
    const handleConfirmOrder = async (orderId) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const updatedOrders = orders.map(order => {
            if (order.id === orderId) order.status = "Shipped"; // or "Delivered"
            return order;
        });

        setOrders(updatedOrders);
        currentUser.orders = updatedOrders;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        await updateUserData({ orders: updatedOrders });
        await updateProductStock(order.items);

        toast.success("Order confirmed and stock updated!");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-6 mt-30">
            <h1 className="text-4xl font-bold text-center mb-10">📦 Order Tracking</h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">You have no orders yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
                            <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                            <p className="text-gray-600 mb-2">Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-2">Total: ₹{order.total.toLocaleString()}</p>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold mb-1">Items:</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.name} × {item.quantity} (₹{item.price})</li>
                                    ))}
                                </ul>
                            </div>

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
