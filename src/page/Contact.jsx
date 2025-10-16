import React, { useState } from 'react';
import { Mail, Phone, MapPin, Search, Heart, User } from 'lucide-react';

// Mock data for navigation links
const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Sale', href: '#' },
];

// Mock component for the site header
const Header = () => (
    <header className="bg-black text-white p-4 shadow-lg sticky top-0 z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-extrabold tracking-wider">
                <span className="text-white">SOLE</span><span className="text-gray-400">NXT</span>
            </div>

            {/* Navigation (Hidden on small screens) */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href} className="hover:text-gray-400 transition duration-150">
                        {link.name}
                    </a>
                ))}
                {/* Active link for Contact page is simulated here */}
                <a href="#" className="text-gray-400">
                    Contact
                </a>
            </nav>

            {/* Actions and Search */}
            <div className="flex items-center space-x-4">
                <div className="relative hidden lg:block">
                    <input
                        type="search"
                        placeholder="Search for shoes..."
                        className="w-64 p-2 pl-10 rounded-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                <div className="flex space-x-4">
                    <button className="p-2 hover:text-gray-400 transition duration-150 rounded-full">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:text-gray-400 transition duration-150 rounded-full">
                        <User className="w-5 h-5" />
                    </button>
                </div>

                {/* Login Button (Matching style from image) */}
                <button className="bg-white text-black font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition duration-150 text-sm hidden sm:block">
                    Login
                </button>
            </div>
        </div>
    </header>
);

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'loading'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('loading');

        // --- Mock API Call Simulation ---
        // In a real application, you would make a fetch or axios call here
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log('Form Submitted:', formData);
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (error) {
            console.error('Submission failed:', error);
            setSubmissionStatus('error');
        }
        // --- End Mock API Call Simulation ---
    };

    const contactInfo = [
        { icon: Mail, title: 'Email Us', detail: 'support@solenxt.com' },
        { icon: Phone, title: 'Call Us', detail: '+1 (555) 123-4567' },
        { icon: MapPin, title: 'Our Location', detail: '123 Sneaker St, Cityville, CA 90210' },
    ];

    const InputField = ({ label, name, type = 'text', required = true }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-gray-400 focus:outline-none transition duration-150"
            />
        </div>
    );

    const TextAreaField = ({ label, name, required = true }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                rows="4"
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-gray-400 focus:outline-none transition duration-150 resize-none"
            ></textarea>
        </div>
    );

    return (
        <div className="min-h-screen bg-black font-sans">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Whether you have a question about an order, our products, or just want to say hello, our team is ready to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Contact Information Cards (Left and Middle) */}
                    <div className="lg:col-span-1 space-y-8">
                        {contactInfo.map((item) => (
                            <div
                                key={item.title}
                                className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 transition duration-300 hover:border-gray-600"
                            >
                                <item.icon className="w-8 h-8 text-white mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.detail}</p>
                            </div>
                        ))}

                        {/* Map Placeholder */}
                        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl h-64 border border-gray-800 overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.22743588938!2d-122.41941648468166!3d37.7749299797587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d4f6c44b%3A0x6b772b1a039d91f!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1686940000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Our Location Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form (Right) */}
                    <div className="lg:col-span-2 bg-gray-900 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
                        <h2 className="text-3xl font-bold text-white mb-8">Send Us a Message</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <InputField label="Full Name" name="name" />
                                <InputField label="Email Address" name="email" type="email" />
                            </div>

                            <InputField label="Subject" name="subject" />

                            <TextAreaField label="Your Message" name="message" />

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-bold py-3 mt-4 rounded-xl shadow-lg hover:bg-gray-300 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                disabled={submissionStatus === 'loading'}
                            >
                                {submissionStatus === 'loading' ? 'Sending Message...' : 'Submit Inquiry'}
                            </button>

                            {submissionStatus === 'success' && (
                                <p className="mt-4 text-green-400 text-center font-medium">
                                    Thank you! Your message has been sent successfully. We will get back to you soon.
                                </p>
                            )}
                            {submissionStatus === 'error' && (
                                <p className="mt-4 text-red-400 text-center font-medium">
                                    Oops! Something went wrong. Please try again later.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

// The main App component wraps the ContactPage
const Contact = () => <ContactPage />;
export default Contact; // Ensure only App is exported as default