import React from "react";
import video from '../assets/bg1.mp4'
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'

const HeroSection = () => {
    return (
        <section className="relative w-full h-[90vh]  overflow-hidden mt-30">
            <video
                src={video}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            />

            <div className="absolute inset-30   flex flex-col justify-center items-center text-center">
                <h1 className="text-9xl md:text-8xl font-extrabold tracking-tight leading-[1.1] text-center md:text-left">
                    <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_#8b5cf6] lg:drop-shadow-[0_0_20px_#38bdf8]">
                        Step Into
                    </span>
                    <br />
                    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/3 after:h-1 after:bg-orange-500 after:rounded-full after:drop-shadow-[0_0_8px_#f97316]">
                        the Future.
                    </span>
                </h1>
            </div>
            <div className="absolute inset-30   flex flex-col justify-center items-center text-center mt-100">
                <Link to='/product' className=' inline-flex items-center justify-center 
            px-10 py-4 text-lg font-semibold tracking-wider uppercase
            bg-transparent border-2 border-cyan-400 text-white 
            rounded-full shadow-lg transition duration-300 ease-in-out
            hover:bg-cyan-400 hover:text-black hover:shadow-cyan-400/50
            focus:outline-none focus:ring-4 focus:ring-cyan-400/70 shadow-cyan-500/50 "'>
                
                    View Products
                    <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                
                </Link>
            </div>

        </section>
    );
};

export default HeroSection;
