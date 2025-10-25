// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import CountUp from "react-countup";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(234);

  useEffect(() => {
    axios.get("http://localhost:3001/users").then(res => setUsers(res.data));
    axios.get("http://localhost:3001/products").then(res => setProducts(res.data));
  }, []);
  const totalSales = users.reduce((sum, user) => sum + (user.orders?.length || 0), 0);

  const pieData = [
    { name: "Users", value: users.length },
    { name: "Products", value: products.length },
    { name: "Sales", value: totalSales },
  ];

  const COLORS = ["#9CA3AF", "#4B5563", "#1F2937"];

  // Data for users chart
  const userChartData = [
    { name: "Users", count: users.length }
  ];

  // Calculate total revenue from all users' orders
  const totalRevenue = users.reduce((sum, user) => {
    const userOrdersTotal = (user.orders || []).reduce((orderSum, order) => orderSum + order.total, 0);
    return sum + userOrdersTotal;
  }, 0);

  const totalExpenses = products.reduce((sum, product) => sum + product.price, 0);


  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">



      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />

        <div className="flex-1 p-10">
          <h1 className="text-4xl font-bold mb-10">Dashboard Overview</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-10">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={users.length} duration={0.6} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Products</h2>
              <p className="text-3xl mt-2">
                <CountUp end={products.length} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold"> Sales</h2>
              <p className="text-3xl mt-2">
                <CountUp end={totalSales} duration={1.5} />
              </p>
            </div>
          
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <p className="text-3xl mt-2">
                <CountUp end={totalExpenses} duration={1.5} prefix="₹" separator="," />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Revenue</h2>
              <p className="text-3xl mt-2">
                <CountUp end={totalRevenue} duration={1.5} prefix="₹" separator="," />
              </p>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="bg-gray-100 rounded-xl p-10 shadow-lg flex justify-center mb-10">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderRadius: "8px",
                    border: "1px solid #000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Total Users Chart Section */}
          <div className="bg-gray-100 rounded-xl p-10 shadow-lg flex justify-center">
            <ResponsiveContainer width="80%" height={300}>
              <BarChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderRadius: "8px",
                    border: "1px solid #000",
                  }}
                />
                <Bar dataKey="count" fill="#1F2937" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
