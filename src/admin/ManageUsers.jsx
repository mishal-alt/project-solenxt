// src/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import CountUp from "react-countup";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "blocked", "admin"

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3001/users").then((res) => setUsers(res.data));
  };

  // ✅ Toggle Admin Status
  const handleMakeAdmin = async (id, isAdmin) => {
    await axios.patch(`http://localhost:3001/users/${id}`, { isAdmin: !isAdmin });
    fetchUsers();
  };

  // ✅ Toggle Block Status
  const handleBlockUser = async (id, isBlock) => {
    await axios.patch(`http://localhost:3001/users/${id}`, { isBlock: !isBlock });
    fetchUsers();
  };

  // ✅ Filter users based on search & dropdown
  const filteredUsers = users
    .filter(
      (u) =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((u) => {
      if (filter === "blocked") return u.isBlock;
      if (filter === "admin") return u.isAdmin;
      return true; // all users
    });

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

          {/* ✅ Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={users.length} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Admins</h2>
              <p className="text-3xl mt-2">
                <CountUp end={users.filter((u) => u.isAdmin).length} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Blocked</h2>
              <p className="text-3xl mt-2">
                <CountUp end={users.filter((u) => u.isBlock).length} duration={1.5} />
              </p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Active Users</h2>
              <p className="text-3xl mt-2">
                <CountUp end={users.filter((u) => !u.isBlock).length} duration={1.5} />
              </p>
            </div>
          </div>

          {/* ✅ Search & Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex-1 p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="all">All Users</option>
              <option value="blocked">Blocked Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* ✅ Users Table */}
          <table className="w-full border border-black rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Orders</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-300 hover:bg-gray-50 transition">
                  {/* ✅ User Name and ID */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{u.fullName}</p>
                        <p className="text-sm text-gray-500">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* ✅ Email */}
                  <td className="p-3">{u.email}</td>

                  {/* ✅ Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.isBlock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* ✅ Join Date */}
                  <td className="p-3">
                    {new Date(u.joinDate).toLocaleDateString("en-US")}
                  </td>

                  {/* ✅ Orders Count */}
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {u.orders?.length || 0}
                    </span>
                  </td>

                  {/* ✅ Role */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>

                  {/* ✅ Action Buttons */}
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleMakeAdmin(u.id, u.isAdmin)}
                      className={`px-4 py-2 rounded-lg text-white transition ${
                        u.isAdmin
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {u.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>

                    <button
                      onClick={() => handleBlockUser(u.id, u.isBlock)}
                      className={`px-4 py-2 rounded-lg text-white transition ${
                        u.isBlock
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {u.isBlock ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
