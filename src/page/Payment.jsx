// src/user/Payment.jsx
// Importing required dependencies and assets
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import qr from '../assets/qr.jpeg'; // QR image for UPI payment
import { toast } from 'react-toastify'; // For notifications

function Payment() {
    // ✅ Initialize React Router navigation hook
    const navigate = useNavigate();

    // ✅ State to control which step the user is in (1 = Billing, 2 = Payment, 3 = Confirm)
    const [step, setStep] = useState(1);

    // ✅ State to handle when payment/order is completed
    const [orderSuccess, setOrderSuccess] = useState(false);

    // ✅ Load cart data from the currently logged-in user (stored in localStorage)
    const [cart, setCart] = useState(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        return user?.cart || [];
    });

    // ✅ Calculate total price of all items in the cart
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ Billing information form fields
    const [billingInfo, setBillingInfo] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    // ✅ Payment method and card info states
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "" });

    // ✅ Handles billing input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    // ✅ Handles card input changes
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
    };

    // =========================================================================
    // ✅ Function to place an order - FIXED LOGIC TO UPDATE BACKEND
    // =========================================================================
    const placeOrder = async () => {
        // Validate billing fields
        if (!billingInfo.name || !billingInfo.address || !billingInfo.city) {
            toast.error("Please fill all billing details");
            return;
        }

        // Validate card info if card payment is selected
        if (paymentMethod === "card" && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
            toast.error("Please fill all card details");
            return;
        }

        // Get logged-in user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            toast.error("User not logged in.");
            return;
        }

        // 1. Fetch the LATEST user data from the backend to prevent overwriting recent changes
        let userFromBackend;
        try {
            const res = await fetch(`http://localhost:3001/users/${currentUser.id}`);
            if (!res.ok) throw new Error("Failed to fetch latest user data.");
            userFromBackend = await res.json();
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error confirming order details. Please try again.");
            return;
        }

        // ✅ Create a new order object
        const newOrder = {
            id: Date.now(), // Unique order ID
            items: cart, // List of ordered items
            billingInfo,
            total,
            paymentMethod,
            cardInfo: paymentMethod === "card" ? cardInfo : null,
            date: new Date().toISOString(), // Use ISO string for reliable storage/sorting
            status: "Pending",
        };

        // ✅ Prepare updated user data for backend
        const updatedUser = {
            ...userFromBackend, // Start with the latest data from the server
            orders: userFromBackend.orders ? [...userFromBackend.orders, newOrder] : [newOrder],
            cart: [], // Clear cart
        };

        // 2. Send the updated user object (with new order) to the backend API
        try {
            await fetch(`http://localhost:3001/users/${currentUser.id}`, {
                method: "PUT", // PUT replaces the entire user record
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });
            
            // 3. Update the local storage with the new, confirmed data
            currentUser.orders = updatedUser.orders;
            currentUser.cart = updatedUser.cart;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            
            // 4. Show success state and redirect
            setOrderSuccess(true);
            toast.success("Order placed successfully!");
            
            setTimeout(() => {
                navigate("/order"); 
            }, 2000);

        } catch (err) {
            console.error("Error placing order and updating backend:", err);
            toast.error("Order failed to save permanently. Please check your network.");
        }
    };
    // =========================================================================

    // ✅ When order is successfully placed, show success animation
    if (orderSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-white">
                <div className="bg-black p-8 rounded-3xl flex flex-col items-center justify-center gap-4">
                    {/* ✅ Animated success tick */}
                    <svg className="w-24 h-24 text-green-500" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeDasharray="157" strokeDashoffset="157"
                            style={{ animation: 'dashCircle 0.5s forwards ease-out' }}
                        />
                        <path fill="none" stroke="currentColor" strokeWidth="4" d="M14 27l7 7 17-17"
                            strokeDasharray="35" strokeDashoffset="35"
                            style={{ animation: 'dashTick 0.5s 0.5s forwards ease-out' }}
                        />
                    </svg>
                    <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                    <p className="text-gray-300 text-center">
                        Your order has been placed successfully.<br />Redirecting to order tracking...
                    </p>
                </div>
                {/* ✅ Animation keyframes */}
                <style>{`
                    @keyframes dashCircle { to { stroke-dashoffset: 0; } }
                    @keyframes dashTick { to { stroke-dashoffset: 0; } }
                `}</style>
            </div>
        );
    }

    // ✅ Main checkout layout
    return (
        <div className="min-h-screen bg-white text-white p-6 mt-30">
            <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">CHECK OUT</h2>

            {/* ✅ Outer container */}
            <div className="max-w-5xl mx-auto bg-black shadow-2xl rounded-3xl overflow-hidden border border-gray-700">

                {/* ✅ Step indicators (Billing / Payment / Confirm) */}
                <div className="flex justify-between p-4 border-b border-black">
                    {["Billing", "Payment", "Confirm"].map((label, idx) => (
                        <div key={idx}
                            className={`flex-1 text-center py-2 font-medium ${step === idx + 1
                                ? "border-b-4 border-white text-white"
                                : "text-gray-400"}`}>
                            {label}
                        </div>
                    ))}
                </div>

                {/* ✅ Dynamic content based on step */}
                <div className="p-6 space-y-6">

                    {/* ✅ Step 1: Billing Form */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Billing Information</h3>

                            {/* Input fields */}
                            {["name", "email", "address", "city"].map((field) => (
                                <input key={field} type={field === "email" ? "email" : "text"} name={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={billingInfo[field]} onChange={handleInputChange}
                                    className="p-3 rounded-xl w-full bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition"
                                />
                            ))}

                            {/* Postal code + country */}
                            <div className="flex gap-4">
                                <input type="text" name="postalCode" placeholder="Postal Code"
                                    value={billingInfo.postalCode} onChange={handleInputChange}
                                    className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition"
                                />
                                <input type="text" name="country" placeholder="Country"
                                    value={billingInfo.country} onChange={handleInputChange}
                                    className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition"
                                />
                            </div>

                            {/* Continue button */}
                            <button onClick={() => setStep(2)}
                                className="border border-white text-white py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition">
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {/* ✅ Step 2: Payment Method Selection */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Payment Options</h3>

                            {/* Payment method buttons */}
                            <div className="flex gap-4 mb-4">
                                {["card", "upi", "cod"].map((method) => (
                                    <button key={method} onClick={() => setPaymentMethod(method)}
                                        className={`flex-1 p-3 rounded-xl border font-medium transition ${paymentMethod === method
                                            ? "border-white bg-black text-white hover:bg-white hover:text-black"
                                            : "border-gray-700 bg-black text-gray-400 hover:border-white hover:text-white hover:bg-black-700"}`}>
                                        {method === "card" ? "Card" : method === "upi" ? "UPI / QR" : "COD"}
                                    </button>
                                ))}
                            </div>

                            {/* ✅ Card payment form */}
                            {paymentMethod === "card" && (
                                <div className="flex flex-col gap-3">
                                    <input type="text" name="number" placeholder="Card Number"
                                        value={cardInfo.number} onChange={handleCardChange}
                                        className="p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />

                                    <div className="flex gap-4">
                                        <input type="text" name="expiry" placeholder="MM/YY"
                                            value={cardInfo.expiry} onChange={handleCardChange}
                                            className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />
                                        <input type="text" name="cvv" placeholder="CVV"
                                            value={cardInfo.cvv} onChange={handleCardChange}
                                            className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />
                                    </div>
                                </div>
                            )}

                            {/* ✅ UPI Payment with QR */}
                            {paymentMethod === "upi" && (
                                <div className="p-3 border rounded-xl bg-black text-center text-white">
                                    Scan the QR code in your UPI app to pay.
                                    <div className="mt-3 w-32 h-32 mx-auto rounded-lg flex items-center justify-center overflow-hidden">
                                        <img src={qr} alt="UPI QR Code" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* ✅ COD Option */}
                            {paymentMethod === "cod" && (
                                <div className="p-3 border rounded-xl bg-black text-center text-white">
                                    You will pay at the time of delivery.
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="flex justify-between mt-4">
                                <button onClick={() => setStep(1)}
                                    className="border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition">
                                    Back
                                </button>
                                <button onClick={() => setStep(3)}
                                    className="border border-white px-6 py-2 rounded-xl text-white font-semibold hover:bg-white hover:text-black transition">
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ✅ Step 3: Order Confirmation */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Order Confirmation</h3>

                            {/* Display ordered items */}
                            <div className="p-4 border rounded-xl bg-black flex flex-col gap-2 text-white">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                {/* Total amount */}
                                <div className="flex justify-between font-bold mt-2">
                                    <span>Total:</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Place Order button */}
                            <button onClick={placeOrder}
                                className="border border-white mt-4 py-3 rounded-xl font-semibold text-white hover:bg-white hover:text-black transition">
                                Place Order
                            </button>

                            {/* Back to Payment button */}
                            <button onClick={() => setStep(2)}
                                className="border border-white mt-2 py-2 rounded-xl hover:bg-white hover:text-black transition">
                                Back to Payment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Payment;