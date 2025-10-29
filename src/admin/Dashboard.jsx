// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import CountUp from "react-countup";

const Dashboard = () => {
  // Initializing state with empty arrays, as the data will be fetched/loaded
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(234); // This state variable seems unused based on totalSales calculation

  useEffect(() => {
    // Fetches data from the local JSON server
    axios.get("http://localhost:3001/users").then(res => setUsers(res.data));
    axios.get("http://localhost:3001/products").then(res => setProducts(res.data));
  }, []);
  
  // Calculate total number of orders/sales (count of order objects)
  const totalSales = users.reduce((sum, user) => sum + (user.orders?.length || 0), 0);

  const pieData = [
    { name: "Users", value: users.length },
    { name: "Products", value: products.length },
    { name: "Sales", value: totalSales },
  ];

  const COLORS = ["#9CA3AF", "#4B5563", "#1F2937"];

  // Calculate total revenue from all users' orders
  const totalRevenue = users.reduce((sum, user) => {
    // Ensure order.total is a number, falling back to 0 if missing or invalid
    const userOrdersTotal = (user.orders || []).reduce((orderSum, order) => orderSum + (order.total || 0), 0);
    return sum + userOrdersTotal;
  }, 0);

  // Calculate total expenses (assuming total product prices represent inventory cost/expense)
  // Ensure product.price is converted to a number, as some might be strings in your JSON ("18999")
  const totalExpenses = products.reduce((sum, product) => sum + (Number(product.price) || 0), 0);


  // --- START: Logic for Top Products Bar Chart ---
  const productSalesMap = users.reduce((acc, user) => {
    (user.orders || []).forEach(order => {
      // Iterate through items in the order
      (order.items || []).forEach(item => { 
        const productId = item.id; // Using item.id as product ID
        const quantity = item.quantity || 1; 
        
        // Ensure quantity is treated as a number
        acc[productId] = (acc[productId] || 0) + Number(quantity);
      });
    });
    return acc;
  }, {});

  // Convert map to array, find product name, sort, and take the top 5
  const topProducts = Object.entries(productSalesMap)
    .map(([productId, count]) => {
      // Find the product name using the ID from the products state
      const product = products.find(p => p.id === productId); 
      return { 
        name: product ? product.name : `Product ID: ${productId}`, // Use name or fallback
        sales: count 
      };
    })
    .sort((a, b) => b.sales - a.sales) // Sort by sales count (descending)
    .slice(0, 5); // Get the top 5
  // --- END: Logic for Top Products Bar Chart ---


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

          {/* Top Products Sales Chart Section (UPDATED) */}
          <div className="bg-gray-100 rounded-xl p-10 shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Top 5 Most Sold Products (Units)</h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="90%" height={300}>
                {/* Check if topProducts is empty to prevent chart errors */}
                {topProducts.length > 0 ? (
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" /> {/* X-axis for the sales count */}
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      style={{ fontSize: '12px' }} // Reduce font size for long product names
                    /> {/* Y-axis for product names */}
                    <Tooltip
                      formatter={(value, name) => [`${value} units`, 'Total Sales']}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        borderRadius: "8px",
                        border: "1px solid #000",
                      }}
                    />
                    <Bar dataKey="sales" fill="#1F2937" />
                  </BarChart>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Loading or No Sales Data Available.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;