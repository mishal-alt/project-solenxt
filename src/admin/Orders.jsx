// src/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import CountUp from "react-countup"; // ✅ Import CountUp

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/users")
      .then(res => {
        const users = res.data;

        // Extract all orders from all users
        const allOrders = users.flatMap(user =>
          (user.orders || []).map(order => ({
            id: order.id,
            customer: user.fullName,
            total: order.total,
            status: order.status,
            date: order.date,
            items: order.items, // Include all ordered products
          }))
        );

        setOrders(allOrders);
      })
      .catch(err => console.error(err));
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">

      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Orders</h1>

          {/* ✅ Stats Cards with CountUp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-3xl mt-2">
                <CountUp end={totalOrders} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Revenue</h2>
              <p className="text-3xl mt-2">
                ₹<CountUp end={totalRevenue} duration={1.5} separator="," />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Shipped</h2>
              <p className="text-3xl mt-2">
                <CountUp end={shippedOrders} duration={1.5} />
              </p>
            </div>
          </div>

          {/* ✅ Orders Table */}
          <table className="w-full border border-black mb-6">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="border-t border-gray-400">
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3">₹{o.total}</td>
                    <td className="p-3">{o.status}</td>
                    <td className="p-3">{new Date(o.date).toLocaleString()}</td>
                  </tr>

                  {/* Nested table for products in this order */}
                  <tr>
                    <td colSpan={5} className="p-3 bg-gray-100">
                      <table className="w-full border border-gray-300">
                        <thead className="bg-gray-300">
                          <tr>
                            <th className="p-2 text-left">Product Name</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map((item) => (
                            <tr key={item.id} className="border-t border-gray-200">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">₹{item.price}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">{item.cat}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
