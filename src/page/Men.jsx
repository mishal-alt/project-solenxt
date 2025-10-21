import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Men() {
  const [men, setMen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("default"); // ✅ new state for sorting

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        const filteredMen = data.filter((item) => item.cat === "men");
        setMen(filteredMen);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔍 Search filter
  let filteredProducts = men.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 💰 Price Sorting Logic
  if (sort === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-black min-h-screen py-20 px-6 mt-20">
      {/* 🧩 Header + Search + Sort in one line */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/3 after:h-1 after:bg-orange-500 after:rounded-full after:drop-shadow-[0_0_8px_#f97316]">
            MEN
          </span>
        </h1>

        {/* 🔍 Search Box */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search men's products..."
            className="flex-grow p-3 rounded-lg bg-white text-black focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* 💰 Sort Dropdown */}
          <select
            className="p-3 rounded-lg bg-black text-white border border-gray-400"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 🛍 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition duration-300 bg-white transform hover:-translate-y-3"
            >
              <Link to={`/product/${product.id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-xl"
                />
                <h2 className="mt-3 text-lg font-bold text-black">
                  {product.name}
                </h2>
                <p className="text-gray-700 mt-1">₹{product.price}</p>
                <p
                  className={
                    product.stoke > 0
                      ? "text-green-700 mt-1"
                      : "text-red-500 font-bold mt-1"
                  }
                >
                  {product.stoke > 0
                    ? `Stock left: ${product.stoke}`
                    : "Out Of Stock"}
                </p>
              </Link>

              {/* Buttons */}
              <div className="flex gap-4 mt-3">
                <button className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                  Add To Cart
                </button>
                <button className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                  BUY
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Men;
