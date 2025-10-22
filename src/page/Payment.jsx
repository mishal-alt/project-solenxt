import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import qr from '../assets/qr.jpeg';
import { toast } from 'react-toastify';

function Payment() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [cart, setCart] = useState(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        return user?.cart || [];
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [billingInfo, setBillingInfo] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
    };

    const placeOrder = () => {
        if (!billingInfo.name || !billingInfo.address || !billingInfo.city) {
            alert("Please fill all billing details");
            return;
        }
        if (paymentMethod === "card" && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
            alert("Please fill all card details");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const newOrder = {
            id: Date.now(), // unique order id
            items: cart,
            billingInfo,
            total,
            paymentMethod,
            cardInfo: paymentMethod === "card" ? cardInfo : null,
            date: new Date(),
            status: "Pending",
        };

        currentUser.orders = currentUser.orders ? [...currentUser.orders, newOrder] : [newOrder];
        currentUser.cart = []; // clear cart after order

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        setOrderSuccess(true);
        toast.success("Order placed successfully!");

        // Redirect to order tracking page after 2 seconds
        setTimeout(() => navigate("/order"), 2000);
    };

    if (orderSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-white">
                <div className="bg-black p-8 rounded-3xl flex flex-col items-center justify-center gap-4">
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
                <style>{`
                    @keyframes dashCircle { to { stroke-dashoffset: 0; } }
                    @keyframes dashTick { to { stroke-dashoffset: 0; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-white p-6 mt-30">
            <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">CHECK OUT</h2>
            <div className="max-w-5xl mx-auto bg-black shadow-2xl rounded-3xl overflow-hidden border border-gray-700">
                <div className="flex justify-between p-4 border-b border-black">
                    {["Billing", "Payment", "Confirm"].map((label, idx) => (
                        <div key={idx} className={`flex-1 text-center py-2 font-medium ${step === idx + 1 ? "border-b-4 border-white text-white" : "text-gray-400"}`}>
                            {label}
                        </div>
                    ))}
                </div>

                <div className="p-6 space-y-6">
                    {/* Step 1: Billing */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Billing Information</h3>
                            {["name", "email", "address", "city"].map((field) => (
                                <input key={field} type={field === "email" ? "email" : "text"} name={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={billingInfo[field]} onChange={handleInputChange}
                                    className="p-3 rounded-xl w-full bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition"
                                />
                            ))}
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
                            <button onClick={() => setStep(2)}
                                className="border border-white text-white py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition">
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Payment Options</h3>
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

                            {paymentMethod === "card" && (
                                <div className="flex flex-col gap-3">
                                    <input type="text" name="number" placeholder="Card Number" value={cardInfo.number} onChange={handleCardChange}
                                        className="p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />
                                    <div className="flex gap-4">
                                        <input type="text" name="expiry" placeholder="MM/YY" value={cardInfo.expiry} onChange={handleCardChange}
                                            className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />
                                        <input type="text" name="cvv" placeholder="CVV" value={cardInfo.cvv} onChange={handleCardChange}
                                            className="p-3 rounded-xl flex-1 bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "upi" && (
                                <div className="p-3 border rounded-xl bg-black text-center text-white">
                                    Scan the QR code in your UPI app to pay.
                                    <div className="mt-3 w-32 h-32 mx-auto rounded-lg flex items-center justify-center overflow-hidden">
                                        <img src={qr} alt="UPI QR Code" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "cod" && (
                                <div className="p-3 border rounded-xl bg-black text-center text-white">
                                    You will pay at the time of delivery.
                                </div>
                            )}

                            <div className="flex justify-between mt-4">
                                <button onClick={() => setStep(1)} className="border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition">
                                    Back
                                </button>
                                <button onClick={() => setStep(3)} className="border border-white px-6 py-2 rounded-xl text-white font-semibold hover:bg-white hover:text-black transition">
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-white tracking-wide">Order Confirmation</h3>
                            <div className="p-4 border rounded-xl bg-black flex flex-col gap-2 text-white">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold mt-2">
                                    <span>Total:</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onClick={placeOrder}
                                className="border border-white mt-4 py-3 rounded-xl font-semibold text-white hover:bg-white hover:text-black transition">
                                Place Order
                            </button>
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
