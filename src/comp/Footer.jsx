import React from "react";
import logo from '../assets/1.png'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-screen bg-black text-gray-300 py-12">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo + Description */}
        <div className="w-full">
          <h2 className="text-3xl font-bold text-white mb-3">
            Sole<span className="text-red-500">.nxt</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">Step into the future with every pair.</p>

        </div>

        {/* Shop Links */}
        <div className="w-full">
          <h3 className="text-white font-semibold mb-4 text-lg">Shop</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">Men</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">Women</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">Sale</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="w-full">
          <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200 text-base">Contact</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="w-full">
          <h3 className="text-white font-semibold mb-4 text-lg">Follow Us</h3>
          <div className="flex space-x-5 text-2xl mb-6">
            {/* <img src={logo} alt="" className="h-30 w-30 object-contain" /> */}
            <Instagram />
            <Twitter />
            <Facebook />
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-full border-t border-gray-700 mt-12 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Sole.nxt — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;