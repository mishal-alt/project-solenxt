import React from 'react';
import { Sparkles, Zap, Users, ShieldCheck, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
// Main, single-file component for the About Page
const About = () => {

    // Data for the Core Values section
    const coreValues = [
        {
            icon: ShieldCheck,
            title: "Authenticity Guaranteed",
            description: "Every pair is meticulously inspected to ensure 100% authenticity. We stand behind our curated collection."
        },
        {
            icon: Sparkles,
            title: "Unrivaled Craftsmanship",
            description: "We partner only with brands dedicated to innovation and the highest standards of material quality and design."
        },
        {
            icon: Users,
            title: "The SOLE NXT Community",
            description: "More than a store, we're a hub for sneaker culture. Join the movement and share your passion."
        },
        {
            icon: Footprints,
            title: "Style Forward",
            description: "We are constantly scanning the horizon for the next trend, bringing you styles before they hit the mainstream."
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-50 font-sans p-4 md:p-8">
            {/* Navigation Header Mockup (Minimalist) */}
            <header className="flex justify-between items-center max-w-6xl mx-auto py-4 mb-10 border-b border-gray-800">
                <h1 className="text-3xl font-extrabold tracking-widest text-white">
                    SOLE<span className="text-pink-500">NXT</span>
                </h1>
            </header>

            {/* Hero Section */}
            <section className="text-center py-20 max-w-6xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-white">
                    Our Journey. Your Next Step.
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    We are the curators of tomorrow's footwear, dedicated to connecting enthusiasts with the rarest, most innovative, and most authentic soles on the market.
                </p>
            </section>

            {/* --- Main Content Section --- */}
            <main className="max-w-6xl mx-auto mt-12 space-y-20">

                {/* The SOLE NXT Story */}
                <div className="grid md:grid-cols-2 gap-12 items-center border-b border-gray-800 pb-16">
                    <div className="order-2 md:order-1">
                        <h3 className="text-4xl font-bold mb-6 text-white border-l-4 border-pink-500 pl-4">
                            The Genesis of Innovation
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                            SOLE NXT was founded by a collective of lifelong sneakerheads frustrated by fragmented marketplaces and uncertain authenticity. We saw a future where finding your grail—that perfect, next-level shoe—was seamless, trustworthy, and inspiring. We built this platform not just as a store, but as a commitment to the craft.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            From limited-edition releases to timeless classics, every product in our collection is hand-selected and verified. Our mission is simple: to honor the legacy of iconic designs while championing the **next era** of footwear innovation.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 bg-gray-800 p-6 rounded-xl shadow-lg shadow-gray-900">
                        <Zap className="w-12 h-12 text-pink-500 mb-4" />
                        <p className="text-gray-200 italic">"The right pair of shoes isn't just an accessory; it's a statement about where you're going next."</p>
                    </div>
                </div>

                {/* Our Core Values Grid */}
                <div className="pt-4">
                    <h3 className="text-4xl font-bold text-center mb-12 text-white">
                        Our Core Values
                    </h3>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-pink-500 transition duration-300 transform hover:scale-[1.02]"
                            >
                                <value.icon className="w-8 h-8 text-pink-500 mb-3" />
                                <h4 className="text-xl font-semibold mb-2 text-white">{value.title}</h4>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact/CTA Footer Section */}
                <div className="text-center py-16">
                    <h3 className="text-3xl font-bold mb-4 text-white">
                        Ready to Discover Your Next Sole?
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Explore our curated collections, dive into the culture on our blog, or reach out to our team of dedicated sole experts.
                    </p>
                    <Link to='/product'><a
                        href="/Home#premium-collection" // Placeholder link
                        className="inline-block px-8 py-3 text-lg font-medium text-black bg-pink-500 rounded-lg shadow-xl hover:bg-pink-400 transition transform hover:scale-105"
                    >
                        Shop 
                    </a>
                    </Link>
                </div>
            </main>

        </div>
    );
};

export default About;
