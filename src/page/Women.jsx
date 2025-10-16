import React from 'react'
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";

function Women() {
  const [women, setwomen] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        const women = data.filter((item) => item.cat === "women");
        setwomen(women);
      });
  }, []);
  return (
    <>
      <div className="bg-black min-h-screen py-20 px-6">
        <h1 class="text-5xl md:text-7xl font-extrabold text-center tracking-tight p-10">
          <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/3 after:h-1 after:bg-orange-500 after:rounded-full after:drop-shadow-[0_0_8px_#f97316]">
            WOMEN
          </span>
        </h1>


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 ">
          {women.map((product) => (
            <div
              key={product.id}
              className="border rounded-2xl p-4 shadow-lg hover:shadow-2xl transition duration-300 bg-white transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2x"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover rounded-xl"
              />
              <FiHeart className="ml-auto text-2xl text-gray-600 hover:text-black cursor-pointer transition mt-3.5" />

              <h2 className="mt-3 text-lg font-bold text-black">{product.name}</h2>
              <p className="text-gray-700 mt-1">₹{product.price}</p>
              <button className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>


  )
}

export default Women